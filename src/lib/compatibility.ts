// RETRO Qatar — PC Builder Compatibility Engine

import type { Product } from '@/types';
import type { BuilderStep, CompatibilityStatus } from '@/stores/usePCBuilderStore';

export interface CompatibilityCheck {
  status: CompatibilityStatus;
  messages: string[];
}

function getFormFactor(name: string): 'E-ATX' | 'ATX' | 'Micro-ATX' | 'Mini-ITX' {
  const n = name.toLowerCase();
  if (n.includes('e-atx') || n.includes('eatx')) return 'E-ATX';
  if (n.includes('micro-atx') || n.includes('micro atx') || n.includes('matx') || n.includes('m-atx')) return 'Micro-ATX';
  if (n.includes('mini-itx') || n.includes('mini itx') || n.includes('mitx') || n.includes('m-itx')) return 'Mini-ITX';
  return 'ATX';
}

function getCaseFormFactor(caseProd: Product): 'E-ATX' | 'ATX' | 'Micro-ATX' | 'Mini-ITX' {
  const specType = caseProd.specs?.type?.toLowerCase() || '';
  if (specType.includes('mini') || specType.includes('itx')) return 'Mini-ITX';
  if (specType.includes('micro') || specType.includes('matx')) return 'Micro-ATX';
  if (specType.includes('eatx') || specType.includes('e-atx')) return 'E-ATX';
  
  const n = caseProd.nameEn.toLowerCase();
  if (n.includes('mini-itx') || n.includes('mini itx') || n.includes('mitx') || n.includes('mini')) return 'Mini-ITX';
  if (n.includes('micro-atx') || n.includes('micro atx') || n.includes('matx') || n.includes('micro')) return 'Micro-ATX';
  if (n.includes('e-atx') || n.includes('eatx')) return 'E-ATX';
  return 'ATX';
}

export function checkCompatibility(parts: Partial<Record<BuilderStep, Product>>): CompatibilityCheck {
  const messages: string[] = [];
  let status: CompatibilityStatus = 'compatible';

  const cpu = parts.cpu;
  const mobo = parts.motherboard;
  const ram = parts.ram;
  const psu = parts.psu;
  const casePart = parts.case;
  const gpu = parts.gpu;

  // 1. CPU & Motherboard Socket Compatibility
  if (cpu && mobo) {
    const cpuSocket = cpu.specs?.socket;
    const moboSocket = mobo.specs?.socket;

    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      status = 'incompatible';
      messages.push(`Socket mismatch: CPU uses ${cpuSocket}, but Motherboard uses ${moboSocket}.`);
    }
  }

  // 2. Motherboard & RAM DDR Type Compatibility
  if (mobo && ram) {
    const moboMemoryType = mobo.specs?.ramType?.toLowerCase() || mobo.specs?.memoryType?.toLowerCase() || '';
    const ramMemoryType = ram.specs?.ramType?.toLowerCase() || ram.specs?.memoryType?.toLowerCase() || ram.nameEn.toLowerCase();

    if (moboMemoryType.includes('ddr5') && !ramMemoryType.includes('ddr5')) {
      status = 'incompatible';
      messages.push('Motherboard requires DDR5 RAM, but you selected DDR4/other type.');
    } else if (moboMemoryType.includes('ddr4') && !ramMemoryType.includes('ddr4')) {
      status = 'incompatible';
      messages.push('Motherboard requires DDR4 RAM, but you selected DDR5/other type.');
    }
  }

  // 3. Power Supply Wattage Check
  if (psu) {
    let estimatedWattage = 150; // Base system load (Mobo, Cooler, SSD, RAM)
    Object.entries(parts).forEach(([stepName, part]) => {
      if (!part) return;
      if (stepName === 'cpu') {
        estimatedWattage += Number(part.specs?.tdp || 125);
      } else if (stepName === 'gpu') {
        estimatedWattage += Number(part.specs?.tdp || part.specs?.powerDraw || 250);
      }
    });

    const safeWattage = estimatedWattage * 1.25;
    const psuWattage = Number(psu.specs?.wattage || psu.specs?.power || 0);

    if (psuWattage > 0) {
      if (psuWattage < estimatedWattage) {
        status = 'incompatible';
        messages.push(`Power Supply (${psuWattage}W) is lower than estimated peak load (${estimatedWattage}W).`);
      } else if (psuWattage < safeWattage) {
        if (status !== 'incompatible') status = 'warning';
        messages.push(`Power Supply (${psuWattage}W) is close to peak load. We recommend a ${Math.ceil(safeWattage)}W+ PSU for efficiency.`);
      }
    }
  }

  // 4. Case & Motherboard Form Factor Compatibility
  if (casePart && mobo) {
    const moboFF = getFormFactor(mobo.nameEn);
    const caseFF = getCaseFormFactor(casePart);

    const ffTiers = { 'Mini-ITX': 1, 'Micro-ATX': 2, 'ATX': 3, 'E-ATX': 4 };
    const moboTier = ffTiers[moboFF] || 3;
    const caseTier = ffTiers[caseFF] || 3;

    if (moboTier > caseTier) {
      status = 'incompatible';
      messages.push(`Motherboard size (${moboFF}) is too large for the selected ${caseFF} chassis.`);
    }
  }

  // 5. Dimension Clearance Check (GPU length vs Case size)
  if (casePart && gpu) {
    const caseFF = getCaseFormFactor(casePart);
    const gpuName = gpu.nameEn.toLowerCase();
    const isLargeGpu = gpuName.includes('3 fan') || gpuName.includes('triple fan') || gpuName.includes('4090') || gpuName.includes('5090') || gpuName.includes('4080') || gpuName.includes('5080');

    if (caseFF === 'Mini-ITX' && isLargeGpu) {
      if (status !== 'incompatible') status = 'warning';
      messages.push(`GPU Clearance Warn: Large GPU selected. Verify card length fitment in Mini-ITX cases.`);
    }
  }

  if (Object.keys(parts).length === 0) {
    return { status: 'unchecked', messages: [] };
  }

  return { status, messages };
}
