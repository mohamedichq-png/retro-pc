"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../data/mockData';
import { 
  CpuIcon, 
  GpuIcon, 
  RamIcon, 
  DiskIcon, 
  PowerIcon, 
  FanIcon, 
  CaseIcon, 
  CompareIcon,
  CheckIcon, 
  TrashIcon, 
  ShieldAlertIcon,
  CartIcon
} from '../../components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface BuilderStage {
  key: string;
  labelEn: string;
  labelAr: string;
  icon: React.ReactNode;
  category: string;
}

export default function PcBuilder() {
  const { language, t, isRtl, products, addToCart } = useApp();
  
  // Selection states
  const [selectedParts, setSelectedParts] = useState<Record<string, Product | null>>({
    cpu: null,
    gpu: null,
    ram: null,
    ssd: null,
    motherboard: null,
    psu: null,
    cooling: null,
    case: null,
  });

  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Stages of PC Building
  const stages: BuilderStage[] = [
    { key: 'cpu', labelEn: 'CPU (Processor)', labelAr: 'المعالج (CPU)', icon: <CpuIcon />, category: 'CPUs' },
    { key: 'gpu', labelEn: 'GPU (Graphics Card)', labelAr: 'كرت الشاشة (GPU)', icon: <GpuIcon />, category: 'GPUs' },
    { key: 'motherboard', labelEn: 'Motherboard', labelAr: 'اللوحة الأم (Motherboard)', icon: <CompareIcon />, category: 'Motherboards' },
    { key: 'ram', labelEn: 'RAM (Memory)', labelAr: 'الذاكرة العشوائية (RAM)', icon: <RamIcon />, category: 'RAM' },
    { key: 'ssd', labelEn: 'SSD (Storage)', labelAr: 'قرص التخزين (SSD)', icon: <DiskIcon />, category: 'SSD' },
    { key: 'psu', labelEn: 'PSU (Power Supply)', labelAr: 'مزود الطاقة (PSU)', icon: <PowerIcon />, category: 'PSUs' },
    { key: 'cooling', labelEn: 'CPU Cooling', labelAr: 'مبرد المعالج', icon: <FanIcon />, category: 'Cooling' },
    { key: 'case', labelEn: 'PC Case', labelAr: 'صندوق الكمبيوتر (Case)', icon: <CaseIcon />, category: 'Cases' },
  ];

  const currentStage = stages[activeStageIndex];
  
  // Available parts for current category
  const partsList = products.filter(p => p.status !== 'draft' && p.category === currentStage.category);

  const selectPart = (part: Product) => {
    setSelectedParts(prev => ({
      ...prev,
      [currentStage.key]: part
    }));
  };

  const removePart = (stageKey: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [stageKey]: null
    }));
  };

  // Smart Calculators
  const totalPrice = Object.values(selectedParts).reduce((sum, part) => {
    if (!part) return sum;
    return sum + (part.salePrice ?? part.sellingPrice);
  }, 0);

  const totalWattage = Object.values(selectedParts).reduce((sum, part) => {
    if (!part) return sum;
    const watt = part.specs.wattage ?? 0;
    return sum + Number(watt);
  }, 0);

  const selectedPsu = selectedParts.psu;
  const psuCapacity = selectedPsu ? Number(selectedPsu.specs.wattage ?? 0) : 0;
  const wattageWarning = psuCapacity > 0 && totalWattage > (psuCapacity * 0.85);

  // Socket Compatibility Check
  const selectedCpu = selectedParts.cpu;
  const selectedMb = selectedParts.motherboard;
  const cpuSocket = selectedCpu?.specs.socket;
  const mbSocket = selectedMb?.specs.socket;
  const socketConflict = cpuSocket && mbSocket && cpuSocket !== mbSocket;

  // FPS Estimations
  const selectedGpu = selectedParts.gpu;
  const fpsCyberpunk = selectedGpu ? (selectedGpu.specs.fpsCyberpunk ?? 60) : 0;
  const fpsCoD = selectedGpu ? (selectedGpu.specs.fpsCallOfDuty ?? 90) : 0;
  const fpsValorant = selectedGpu ? (selectedGpu.specs.fpsValorant ?? 240) : 0;

  const handleAddRigToCart = () => {
    let addedCount = 0;
    Object.values(selectedParts).forEach(part => {
      if (part) {
        addToCart(part, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      alert(language === 'ar' ? 'تمت إضافة جميع قطع التجميعة بنجاح إلى السلة!' : 'All custom rig components have been added to your cart!');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Columns: Stage Selector and Catalog */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-purple-500/25 neon-glass rounded-2xl p-6"
        >
          <h1 className="text-2xl font-black text-white tracking-wide uppercase">
            {t('pcBuilderTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('selectParts')}
          </p>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-6">
            {stages.map((stg, idx) => {
              const isSelected = !!selectedParts[stg.key];
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={stg.key}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 glow-cyan' 
                      : isSelected 
                      ? 'border-purple-500/40 bg-purple-950/10 text-purple-400' 
                      : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="h-5 w-5 mb-1 flex items-center justify-center">
                    {stg.icon}
                  </span>
                  <span className="text-[9px] font-bold truncate w-full text-center px-1">
                    {language === 'ar' ? stg.labelAr.split(' ')[0] : stg.labelEn.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Current Part Selection Catalog */}
        <div className="space-y-4 min-h-[400px]">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-cyan-400">{stages[activeStageIndex].icon}</span>
            {isRtl ? currentStage.labelAr : currentStage.labelEn}
          </h2>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStage.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {partsList.map((part) => {
                const isSelected = selectedParts[currentStage.key]?.id === part.id;
                const price = part.salePrice ?? part.sellingPrice;
                
                return (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={part.id}
                    onClick={() => selectPart(part)}
                    className={`group flex rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-950/20 glow-cyan neon-glass-cyan' 
                        : 'border-slate-800 neon-glass hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="h-16 w-16 bg-slate-950 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                      <img src={part.imageUrl} alt={part.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="mx-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 line-clamp-1">
                          {isRtl ? part.nameAr : part.nameEn}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 capitalize">
                          {part.brand} • {part.specs.socket || part.specs.vram || part.specs.capacity || part.specs.wattage || ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-cyan-400">
                          {price} {t('currency')}
                        </span>
                        {isSelected ? (
                          <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                            <CheckIcon size={12} />
                            {isRtl ? 'تم الاختيار' : 'Selected'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold group-hover:text-cyan-400">
                            {isRtl ? 'اختر' : 'Select'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {partsList.length === 0 && (
                <p className="text-xs text-slate-500 italic col-span-2 py-4">
                  {isRtl ? 'لا توجد قطع مضافة لهذه الفئة حالياً.' : 'No components available for this category yet.'}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Build Summary & Smart Calculators */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 lg:col-span-1"
      >
        
        {/* Rig summary board */}
        <div className="border border-purple-500/20 neon-glass rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            {isRtl ? 'ملخص التجميعة' : 'My PC Build Summary'}
          </h3>

          <div className="space-y-3">
            {stages.map((stg) => {
              const part = selectedParts[stg.key];
              return (
                <div key={stg.key} className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{stg.icon}</span>
                    <span className="font-medium text-slate-400 truncate max-w-[80px]">
                      {language === 'ar' ? stg.labelAr.split(' ')[0] : stg.labelEn.split(' ')[0]}
                    </span>
                  </div>
                  {part ? (
                    <div className="flex items-center gap-2 max-w-[150px]">
                      <span className="text-slate-100 truncate text-right text-[11px] font-semibold">
                        {isRtl ? part.nameAr : part.nameEn}
                      </span>
                      <button onClick={() => removePart(stg.key)} className="text-pink-500 hover:text-pink-400 shrink-0 cursor-pointer">
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveStageIndex(stages.findIndex(s => s.key === stg.key))}
                      className="text-[10px] font-bold text-cyan-500 hover:underline cursor-pointer"
                    >
                      + {isRtl ? 'إضافة' : 'Choose'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'المجموع المقدر:' : 'Estimated Total:'}</span>
            <span className="text-xl font-black text-cyan-400">{totalPrice} {t('currency')}</span>
          </div>

          <button
            disabled={Object.values(selectedParts).every(p => p === null)}
            onClick={handleAddRigToCart}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/10 cursor-pointer disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <CartIcon size={14} />
              {isRtl ? 'أضف التجميعة بالكامل للسلة' : 'Add Full Rig to Cart'}
            </span>
          </button>
        </div>

        {/* Compatibility and Power Draw Status */}
        <div className="border border-cyan-500/20 neon-glass rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {t('compatCheck')}
          </h3>

          {/* Socket Check */}
          {socketConflict ? (
            <div className="rounded-xl bg-pink-500/10 border border-pink-500/30 p-3.5 flex gap-2.5 text-xs text-pink-400">
              <ShieldAlertIcon size={18} className="shrink-0 text-pink-500 animate-bounce" />
              <div>
                <p className="font-bold">{isRtl ? 'تعارض في المقبس!' : 'Socket Conflict!'}</p>
                <p className="text-[10px] text-pink-400/80 mt-1">
                  {isRtl 
                    ? `مقبس المعالج (${cpuSocket}) لا يتطابق مع مقبس اللوحة الأم (${mbSocket}).`
                    : `CPU socket (${cpuSocket}) does not match Motherboard socket (${mbSocket}).`}
                </p>
              </div>
            </div>
          ) : selectedCpu && selectedMb ? (
            <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-3.5 flex gap-2.5 text-xs text-green-400">
              <CheckIcon size={18} className="shrink-0 text-green-500" />
              <div>
                <p className="font-bold">{isRtl ? 'المقابس متوافقة!' : 'Socket Compatible!'}</p>
                <p className="text-[10px] text-green-400/80 mt-1">
                  {isRtl 
                    ? `كل من المعالج واللوحة الأم يدعمان مقبس ${cpuSocket}.`
                    : `Both CPU and Motherboard use the ${cpuSocket} socket.`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic">
              {isRtl ? 'اختر المعالج واللوحة الأم للتحقق من توافق المقبس.' : 'Select CPU and Motherboard to verify socket compatibility.'}
            </p>
          )}

          {/* Wattage Calculator */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>{t('estPower')}</span>
              <span className="text-cyan-400">{totalWattage} W</span>
            </div>
            
            {/* Simple Progress Bar */}
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  wattageWarning ? 'bg-pink-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, psuCapacity > 0 ? (totalWattage / psuCapacity) * 100 : 20)}%` }}
              ></div>
            </div>

            {selectedPsu ? (
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{isRtl ? 'مزود الطاقة المختار:' : 'Selected PSU capacity:'} {psuCapacity} W</span>
                <span>{Math.round(psuCapacity > 0 ? (totalWattage / psuCapacity) * 100 : 0)}% {isRtl ? 'حمل' : 'Load'}</span>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 italic">
                {isRtl ? 'أضف مزود طاقة للتحقق من كفاءة استهلاك واط التجميعة.' : 'Add a PSU to check power capacity margin.'}
              </p>
            )}

            {wattageWarning && (
              <p className="text-[10px] text-pink-400 font-bold mt-2 animate-pulse">
                {isRtl 
                  ? '⚠️ تحذير: استهلاك الطاقة يقترب من الحد الأقصى للمزود! اختر مزود طاقة أقوى.'
                  : '⚠️ Warning: System load exceeds 85% of PSU. Recommend upgrading your PSU capacity.'}
              </p>
            )}
          </div>
        </div>

        {/* Gaming Performance Simulator */}
        <div className="border border-purple-500/20 neon-glass rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {t('estFps')}
          </h3>

          <div className="space-y-3.5">
            {/* Cyberpunk */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">{t('fpsCyberpunk')}</span>
                <span className="text-cyan-400 font-bold">{fpsCyberpunk} FPS</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-700" 
                  style={{ width: `${Math.min(100, (fpsCyberpunk / 160) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* CoD */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">{t('fpsCoD')}</span>
                <span className="text-purple-400 font-bold">{fpsCoD} FPS</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-700" 
                  style={{ width: `${Math.min(100, (fpsCoD / 240) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Valorant */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">{t('fpsValorant')}</span>
                <span className="text-pink-400 font-bold">{fpsValorant} FPS</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-700" 
                  style={{ width: `${Math.min(100, (fpsValorant / 700) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {!selectedGpu && (
            <p className="text-[10px] text-slate-500 italic text-center pt-2">
              {isRtl ? 'اختر كرت شاشة (GPU) لمحاكاة أداء الألعاب.' : 'Select a GPU to simulate gaming benchmarks.'}
            </p>
          )}
        </div>

      </motion.div>

    </div>
  );
}
