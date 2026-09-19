import React, { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  calculateConcrete,
  calculatePaint,
  calculateTile,
  calculateElectricityBill,
  calculateCoolingBTU,
} from '../../engine/construction';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { Boxes, Wind, Zap, DollarSign, Paintbrush, Ruler, RotateCcw } from 'lucide-react';

interface ConstructionExpandedViewsProps {
  toolSlug: string;
}

const EmptyStateCard: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 max-w-xs">{subtitle}</p>
  </div>
);

export const ConstructionExpandedViews: React.FC<ConstructionExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // ==========================================
  // CONCRETE CALCULATOR (Defaults to empty)
  // ==========================================
  const [concType, setConcType] = useState<'slab' | 'footing' | 'column'>('slab');
  const [concLen, setConcLen] = useState<number | ''>('');
  const [concWid, setConcWid] = useState<number | ''>('');
  const [concThick, setConcThick] = useState<number | ''>(''); // inches
  const [concDia, setConcDia] = useState<number | ''>(''); // inches for column
  const [concHeight, setConcHeight] = useState<number | ''>(''); // feet for column
  const [concQty, setConcQty] = useState<number | ''>('');

  const concResult = useMemo(() => {
    if (concType === 'column') {
      if (typeof concDia !== 'number' || typeof concHeight !== 'number' || concDia <= 0 || concHeight <= 0) {
        return null;
      }
      return calculateConcrete({
        shape: 'column',
        lengthFeet: 0,
        widthFeet: 0,
        depthInches: 0,
        diameterFeet: concDia / 12,
        quantity: typeof concQty === 'number' && concQty > 0 ? concQty : 1,
      });
    }

    if (
      typeof concLen !== 'number' ||
      typeof concWid !== 'number' ||
      typeof concThick !== 'number' ||
      concLen <= 0 ||
      concWid <= 0 ||
      concThick <= 0
    ) {
      return null;
    }

    return calculateConcrete({
      shape: 'slab',
      lengthFeet: concLen,
      widthFeet: concWid,
      depthInches: concThick,
      diameterFeet: 0,
      quantity: typeof concQty === 'number' && concQty > 0 ? concQty : 1,
    });
  }, [concType, concLen, concWid, concThick, concDia, concHeight, concQty]);

  // ==========================================
  // PAINT CALCULATOR (Defaults to empty)
  // ==========================================
  const [paintLen, setPaintLen] = useState<number | ''>('');
  const [paintWid, setPaintWid] = useState<number | ''>('');
  const [paintHgt, setPaintHgt] = useState<number | ''>('');
  const [paintDoors, setPaintDoors] = useState<number | ''>('');
  const [paintWindows, setPaintWindows] = useState<number | ''>('');
  const [paintCoats, setPaintCoats] = useState<number | ''>('');

  const paintResult = useMemo(() => {
    if (
      typeof paintLen !== 'number' ||
      typeof paintWid !== 'number' ||
      typeof paintHgt !== 'number' ||
      paintLen <= 0 ||
      paintWid <= 0 ||
      paintHgt <= 0
    ) {
      return null;
    }
    return calculatePaint({
      lengthFeet: paintLen,
      widthFeet: paintWid,
      heightFeet: paintHgt,
      doorsCount: typeof paintDoors === 'number' ? paintDoors : 0,
      windowsCount: typeof paintWindows === 'number' ? paintWindows : 0,
      coats: typeof paintCoats === 'number' && paintCoats > 0 ? paintCoats : 2,
      includeCeiling: false,
    });
  }, [paintLen, paintWid, paintHgt, paintDoors, paintWindows, paintCoats]);

  // ==========================================
  // TILE CALCULATOR (Defaults to empty)
  // ==========================================
  const [tileRoomLen, setTileRoomLen] = useState<number | ''>('');
  const [tileRoomWid, setTileRoomWid] = useState<number | ''>('');
  const [tileLenInches, setTileLenInches] = useState<number | ''>('');
  const [tileWidInches, setTileWidInches] = useState<number | ''>('');
  const [tileWaste, setTileWaste] = useState<number | ''>('');
  const [tilesPerBox, setTilesPerBox] = useState<number | ''>('');

  const tileResult = useMemo(() => {
    if (
      typeof tileRoomLen !== 'number' ||
      typeof tileRoomWid !== 'number' ||
      typeof tileLenInches !== 'number' ||
      typeof tileWidInches !== 'number' ||
      tileRoomLen <= 0 ||
      tileRoomWid <= 0 ||
      tileLenInches <= 0 ||
      tileWidInches <= 0
    ) {
      return null;
    }
    return calculateTile({
      roomLengthFeet: tileRoomLen,
      roomWidthFeet: tileRoomWid,
      tileLengthInches: tileLenInches,
      tileWidthInches: tileWidInches,
      wastePercentage: typeof tileWaste === 'number' ? tileWaste : 10,
      tilesPerBox: typeof tilesPerBox === 'number' && tilesPerBox > 0 ? tilesPerBox : 10,
    });
  }, [tileRoomLen, tileRoomWid, tileLenInches, tileWidInches, tileWaste, tilesPerBox]);

  // ==========================================
  // ROOM AREA CALCULATOR (Defaults to empty)
  // ==========================================
  const [roomLen, setRoomLen] = useState<number | ''>('');
  const [roomWid, setRoomWid] = useState<number | ''>('');
  const [roomHgt, setRoomHgt] = useState<number | ''>('');

  const roomAreaResult = useMemo(() => {
    if (
      typeof roomLen !== 'number' ||
      typeof roomWid !== 'number' ||
      roomLen <= 0 ||
      roomWid <= 0
    ) {
      return null;
    }
    const hgt = typeof roomHgt === 'number' && roomHgt > 0 ? roomHgt : 8;
    const floorArea = roomLen * roomWid;
    const perimeter = 2 * (roomLen + roomWid);
    const wallArea = perimeter * hgt;
    const volume = floorArea * hgt;
    return {
      floorAreaSqFt: floorArea,
      floorAreaSqM: Math.round(floorArea * 0.092903 * 10) / 10,
      perimeterFt: perimeter,
      wallAreaSqFt: wallArea,
      volumeCuFt: volume,
    };
  }, [roomLen, roomWid, roomHgt]);

  // ==========================================
  // CONSTRUCTION COST CALCULATOR (Defaults to empty)
  // ==========================================
  const [constArea, setConstArea] = useState<number | ''>('');
  const [constTier, setConstTier] = useState<'standard' | 'premium' | 'luxury'>('standard');

  const constCostResult = useMemo(() => {
    if (typeof constArea !== 'number' || constArea <= 0) {
      return null;
    }
    const ratePerSqFt = constTier === 'luxury' ? 320 : constTier === 'premium' ? 220 : 150;
    const total = constArea * ratePerSqFt;
    return {
      totalCost: total,
      ratePerSqFt,
      framingStructure: Math.round(total * 0.28),
      finishesPlumbing: Math.round(total * 0.32),
      hvacElectrical: Math.round(total * 0.20),
      permitsManagement: Math.round(total * 0.20),
    };
  }, [constArea, constTier]);

  // ==========================================
  // ELECTRICITY BILL CALCULATOR (Defaults to empty)
  // ==========================================
  const [elecWatts, setElecWatts] = useState<number | ''>('');
  const [elecHours, setElecHours] = useState<number | ''>('');
  const [elecRate, setElecRate] = useState<number | ''>('');

  const elecResult = useMemo(() => {
    if (
      typeof elecWatts !== 'number' ||
      typeof elecHours !== 'number' ||
      typeof elecRate !== 'number' ||
      elecWatts <= 0 ||
      elecHours <= 0 ||
      elecRate <= 0
    ) {
      return null;
    }
    return calculateElectricityBill({
      wattage: elecWatts,
      dailyHours: elecHours,
      costPerKWh: elecRate,
    });
  }, [elecWatts, elecHours, elecRate]);

  // ==========================================
  // AC BTU CALCULATOR (Defaults to empty)
  // ==========================================
  const [acArea, setAcArea] = useState<number | ''>('');
  const [acSun, setAcSun] = useState<'shaded' | 'normal' | 'sunny'>('normal');
  const [acOccupants, setAcOccupants] = useState<number | ''>('');
  const [acKitchen, setAcKitchen] = useState(false);

  const acResult = useMemo(() => {
    if (typeof acArea !== 'number' || acArea <= 0) {
      return null;
    }
    const side = Math.sqrt(acArea);
    const occupantsCount = typeof acOccupants === 'number' && acOccupants >= 0 ? acOccupants : 2;
    const baseBTU = calculateCoolingBTU({
      lengthFeet: side,
      widthFeet: side,
      ceilingHeightFeet: 8,
      sunExposure: acSun === 'shaded' ? 'shady' : acSun === 'sunny' ? 'sunny' : 'normal',
      occupants: occupantsCount,
    });
    const extraBTU = acKitchen ? 4000 : 0;
    const totalBTU = baseBTU.adjustedBTU + extraBTU;
    return {
      recommendedBTU: totalBTU,
      recommendedTons: Math.round((totalBTU / 12000) * 10) / 10,
    };
  }, [acArea, acSun, acOccupants, acKitchen]);

  // Reset Handlers
  const handleResetConcrete = () => {
    setConcType('slab');
    setConcLen('');
    setConcWid('');
    setConcThick('');
    setConcDia('');
    setConcHeight('');
    setConcQty('');
  };

  const handleResetPaint = () => {
    setPaintLen('');
    setPaintWid('');
    setPaintHgt('');
    setPaintDoors('');
    setPaintWindows('');
    setPaintCoats('');
  };

  const handleResetTile = () => {
    setTileRoomLen('');
    setTileRoomWid('');
    setTileLenInches('');
    setTileWidInches('');
    setTileWaste('');
    setTilesPerBox('');
  };

  const handleResetRoomArea = () => {
    setRoomLen('');
    setRoomWid('');
    setRoomHgt('');
  };

  const handleResetConstCost = () => {
    setConstArea('');
    setConstTier('standard');
  };

  const handleResetElectricity = () => {
    setElecWatts('');
    setElecHours('');
    setElecRate('');
  };

  const handleResetAC = () => {
    setAcArea('');
    setAcSun('normal');
    setAcOccupants('');
    setAcKitchen(false);
  };

  // 1. CONCRETE CALCULATOR
  if (toolSlug === 'concrete-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parameters</span>
            <button
              type="button"
              id="concrete-reset-btn"
              onClick={handleResetConcrete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setConcType('slab')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                concType === 'slab' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Slab / Patio
            </button>
            <button
              type="button"
              onClick={() => setConcType('footing')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                concType === 'footing' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Footing / Trench
            </button>
            <button
              type="button"
              onClick={() => setConcType('column')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                concType === 'column' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Circular Column
            </button>
          </div>

          {concType !== 'column' ? (
            <>
              <NumberSliderInput
                id="conc-len"
                label="Length (Feet)"
                value={concLen}
                onChange={setConcLen}
                min={1}
                max={150}
                step={0.5}
                suffix="ft"
              />
              <NumberSliderInput
                id="conc-wid"
                label="Width (Feet)"
                value={concWid}
                onChange={setConcWid}
                min={1}
                max={100}
                step={0.5}
                suffix="ft"
              />
              <NumberSliderInput
                id="conc-thick"
                label="Thickness / Depth (Inches)"
                value={concThick}
                onChange={setConcThick}
                min={1}
                max={24}
                step={0.5}
                suffix="in"
              />
            </>
          ) : (
            <>
              <NumberSliderInput
                id="conc-dia"
                label="Column Diameter (Inches)"
                value={concDia}
                onChange={setConcDia}
                min={4}
                max={48}
                step={1}
                suffix="in"
              />
              <NumberSliderInput
                id="conc-height"
                label="Column Height (Feet)"
                value={concHeight}
                onChange={setConcHeight}
                min={1}
                max={30}
                step={0.5}
                suffix="ft"
              />
              <NumberSliderInput
                id="conc-qty"
                label="Number of Columns"
                value={concQty}
                onChange={setConcQty}
                min={1}
                max={50}
                step={1}
              />
            </>
          )}
        </div>

        {concResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Concrete Required</span>
            <div className="text-5xl font-extrabold text-amber-700 tracking-tight mt-2">
              {concResult.cubicYards} yd³
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ({concResult.cubicFeet} ft³ / {concResult.cubicMeters} m³)
            </p>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Pre-mixed 80-lb Bags</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{concResult.premixBags80lb} Bags</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Pre-mixed 60-lb Bags</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{concResult.premixBags60lb} Bags</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Boxes}
            title="Enter Dimensions"
            subtitle="Provide length, width, and thickness to calculate concrete cubic yards and bag estimates."
          />
        )}
      </div>
    );
  }

  // 2. PAINT CALCULATOR
  if (toolSlug === 'paint-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Dimensions</span>
            <button
              type="button"
              id="paint-reset-btn"
              onClick={handleResetPaint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <NumberSliderInput
              id="paint-len"
              label="Length"
              value={paintLen}
              onChange={setPaintLen}
              min={5}
              max={60}
              step={1}
              suffix="ft"
            />
            <NumberSliderInput
              id="paint-wid"
              label="Width"
              value={paintWid}
              onChange={setPaintWid}
              min={5}
              max={60}
              step={1}
              suffix="ft"
            />
            <NumberSliderInput
              id="paint-hgt"
              label="Height"
              value={paintHgt}
              onChange={setPaintHgt}
              min={7}
              max={20}
              step={0.5}
              suffix="ft"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <NumberSliderInput
              id="paint-doors"
              label="Doors (21 sq ft ea)"
              value={paintDoors}
              onChange={setPaintDoors}
              min={0}
              max={10}
              step={1}
            />
            <NumberSliderInput
              id="paint-windows"
              label="Windows (15 sq ft ea)"
              value={paintWindows}
              onChange={setPaintWindows}
              min={0}
              max={15}
              step={1}
            />
            <NumberSliderInput
              id="paint-coats"
              label="Paint Coats"
              value={paintCoats}
              onChange={setPaintCoats}
              min={1}
              max={4}
              step={1}
            />
          </div>
        </div>

        {paintResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paint Required</span>
            <div className="text-5xl font-extrabold text-amber-700 tracking-tight mt-2">
              {paintResult.gallonsRecommended} Gallons
            </div>
            <p className="text-xs text-slate-500 mt-2">({paintResult.liters} Liters) for {typeof paintCoats === 'number' ? paintCoats : 2} coats</p>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Gross Wall Surface</span>
                <span className="text-lg font-bold text-slate-900 mt-1 block">{paintResult.grossWallAreaSqFt} sq ft</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Net Paintable Area</span>
                <span className="text-lg font-bold text-amber-800 mt-1 block">{paintResult.netPaintableAreaSqFt} sq ft</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Paintbrush}
            title="Enter Room Dimensions"
            subtitle="Provide wall length, width, and ceiling height to compute total paint gallons and surface area."
          />
        )}
      </div>
    );
  }

  // 3. TILE CALCULATOR
  if (toolSlug === 'tile-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room & Tile Area</span>
            <button
              type="button"
              id="tile-reset-btn"
              onClick={handleResetTile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              id="tile-room-len"
              label="Room Length (Feet)"
              value={tileRoomLen}
              onChange={setTileRoomLen}
              min={3}
              max={60}
              step={0.5}
              suffix="ft"
            />
            <NumberSliderInput
              id="tile-room-wid"
              label="Room Width (Feet)"
              value={tileRoomWid}
              onChange={setTileRoomWid}
              min={3}
              max={60}
              step={0.5}
              suffix="ft"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              id="tile-len-in"
              label="Tile Length (Inches)"
              value={tileLenInches}
              onChange={setTileLenInches}
              min={2}
              max={48}
              step={1}
              suffix="in"
            />
            <NumberSliderInput
              id="tile-wid-in"
              label="Tile Width (Inches)"
              value={tileWidInches}
              onChange={setTileWidInches}
              min={2}
              max={48}
              step={1}
              suffix="in"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              id="tile-waste"
              label="Cutting Waste Buffer (%)"
              value={tileWaste}
              onChange={setTileWaste}
              min={0}
              max={25}
              step={5}
              suffix="%"
            />
            <NumberSliderInput
              id="tile-per-box"
              label="Tiles per Box"
              value={tilesPerBox}
              onChange={setTilesPerBox}
              min={1}
              max={50}
              step={1}
            />
          </div>
        </div>

        {tileResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Boxes to Purchase</span>
            <div className="text-5xl font-extrabold text-amber-700 tracking-tight mt-2">
              {tileResult.boxesNeeded} Boxes
            </div>
            <p className="text-xs text-slate-500 mt-2">Total {tileResult.totalTilesNeeded} Tiles with {typeof tileWaste === 'number' ? tileWaste : 10}% waste buffer</p>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Actual Floor Area</span>
                <span className="text-lg font-bold text-slate-900 mt-1 block">{tileResult.roomAreaSqFt} sq ft</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Total Ordered Sq Ft</span>
                <span className="text-lg font-bold text-amber-800 mt-1 block">{tileResult.totalSqFtWithWaste} sq ft</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Boxes}
            title="Enter Room & Tile Dimensions"
            subtitle="Specify room dimensions and tile sizing to calculate total tiles and box counts."
          />
        )}
      </div>
    );
  }

  // 4. ROOM AREA CALCULATOR
  if (toolSlug === 'room-area-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Dimensions</span>
            <button
              type="button"
              id="room-area-reset-btn"
              onClick={handleResetRoomArea}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <NumberSliderInput
            id="room-len"
            label="Room Length (Feet)"
            value={roomLen}
            onChange={setRoomLen}
            min={4}
            max={80}
            step={0.5}
            suffix="ft"
          />
          <NumberSliderInput
            id="room-wid"
            label="Room Width (Feet)"
            value={roomWid}
            onChange={setRoomWid}
            min={4}
            max={80}
            step={0.5}
            suffix="ft"
          />
          <NumberSliderInput
            id="room-hgt"
            label="Ceiling Height (Feet)"
            value={roomHgt}
            onChange={setRoomHgt}
            min={7}
            max={20}
            step={0.5}
            suffix="ft"
          />
        </div>

        {roomAreaResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Floor Surface Area</span>
            <div className="text-5xl font-extrabold text-amber-700 tracking-tight mt-2">
              {roomAreaResult.floorAreaSqFt} sq ft
            </div>
            <p className="text-xs text-slate-500 mt-2">Equivalent to {roomAreaResult.floorAreaSqM} m²</p>

            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Perimeter</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{roomAreaResult.perimeterFt} ft</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Total Wall Area</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{roomAreaResult.wallAreaSqFt} sq ft</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Room Volume</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{roomAreaResult.volumeCuFt} cu ft</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Ruler}
            title="Enter Dimensions"
            subtitle="Provide room length and width to calculate floor area, perimeter, and wall surface."
          />
        )}
      </div>
    );
  }

  // 5. CONSTRUCTION COST CALCULATOR
  if (toolSlug === 'construction-cost-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Specifications</span>
            <button
              type="button"
              id="const-cost-reset-btn"
              onClick={handleResetConstCost}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <NumberSliderInput
            id="const-area"
            label="Total Floor Built-Up Area (Sq Ft)"
            value={constArea}
            onChange={setConstArea}
            min={500}
            max={10000}
            step={100}
            suffix="sq ft"
          />
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Quality / Specification Tier</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setConstTier('standard')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  constTier === 'standard' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Standard ($150/sq ft)
              </button>
              <button
                type="button"
                onClick={() => setConstTier('premium')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  constTier === 'premium' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Premium ($220/sq ft)
              </button>
              <button
                type="button"
                onClick={() => setConstTier('luxury')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  constTier === 'luxury' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Luxury ($320/sq ft)
              </button>
            </div>
          </div>
        </div>

        {constCostResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Total Construction Cost</span>
            <div className="text-4xl font-extrabold text-amber-700 tracking-tight mt-2">
              {formatMoney(constCostResult.totalCost)}
            </div>
            <p className="text-xs text-slate-500 mt-1">At {currencySymbol}{constCostResult.ratePerSqFt} per sq ft average build rate</p>

            <div className="space-y-2 mt-8 pt-6 border-t border-slate-200 text-xs text-left">
              <span className="font-bold text-slate-700 block mb-2">Cost Breakdown Estimate:</span>
              <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Framing, Foundation & Shell (28%):</span>
                <span className="font-bold text-slate-900">{formatMoney(constCostResult.framingStructure)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Interior Finishes, Flooring & Fixtures (32%):</span>
                <span className="font-bold text-slate-900">{formatMoney(constCostResult.finishesPlumbing)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Mechanical, HVAC & Electrical (20%):</span>
                <span className="font-bold text-slate-900">{formatMoney(constCostResult.hvacElectrical)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600">Permits, Design & Contractor Margin (20%):</span>
                <span className="font-bold text-slate-900">{formatMoney(constCostResult.permitsManagement)}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={DollarSign}
            title="Enter Built-Up Area"
            subtitle="Specify planned construction square footage to estimate build costs and trade expense breakdowns."
          />
        )}
      </div>
    );
  }

  // 6. ELECTRICITY BILL CALCULATOR
  if (toolSlug === 'electricity-bill-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Power Usage</span>
            <button
              type="button"
              id="electricity-reset-btn"
              onClick={handleResetElectricity}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <NumberSliderInput
            id="elec-watts"
            label="Appliance Power Rating (Watts)"
            value={elecWatts}
            onChange={setElecWatts}
            min={10}
            max={5000}
            step={50}
            suffix="W"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setElecWatts(60)}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              LED TV (60W)
            </button>
            <button
              type="button"
              onClick={() => setElecWatts(200)}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              Fridge (200W)
            </button>
            <button
              type="button"
              onClick={() => setElecWatts(1500)}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
            >
              Heater / AC (1500W)
            </button>
          </div>
          <NumberSliderInput
            id="elec-hours"
            label="Hours Used Per Day"
            value={elecHours}
            onChange={setElecHours}
            min={0.5}
            max={24}
            step={0.5}
            suffix="Hrs/day"
          />
          <NumberSliderInput
            id="elec-rate"
            label={`Utility Cost per Kilowatt-Hour (${currencySymbol}/kWh)`}
            value={elecRate}
            onChange={setElecRate}
            min={currencySymbol === '₹' ? 0.5 : 0.05}
            max={currencySymbol === '₹' ? 50 : 2.0}
            step={currencySymbol === '₹' ? 0.25 : 0.01}
            prefix={currencySymbol}
          />
        </div>

        {elecResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Operating Cost</span>
            <div className="text-5xl font-extrabold text-amber-700 tracking-tight mt-2">
              {formatMoney(elecResult.monthlyCost)}
            </div>
            <p className="text-xs text-slate-500 mt-2">Consuming {elecResult.monthlyKWh} kWh per month</p>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Daily Cost</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">{formatMoney(elecResult.dailyCost)}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Annual Operating Cost</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">{formatMoney(elecResult.annualCost)}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Zap}
            title="Enter Appliance & Power Specs"
            subtitle="Enter appliance wattage, daily usage hours, and utility rate to calculate monthly and yearly power bills."
          />
        )}
      </div>
    );
  }

  // 7. AC BTU CALCULATOR
  if (toolSlug === 'ac-btu-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room & Climate Parameters</span>
            <button
              type="button"
              id="ac-btu-reset-btn"
              onClick={handleResetAC}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <NumberSliderInput
            id="ac-area"
            label="Room Floor Area (Sq Ft)"
            value={acArea}
            onChange={setAcArea}
            min={100}
            max={1500}
            step={25}
            suffix="sq ft"
          />
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sunlight Exposure</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAcSun('shaded')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  acSun === 'shaded' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Heavily Shaded (-10%)
              </button>
              <button
                type="button"
                onClick={() => setAcSun('normal')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  acSun === 'normal' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Normal Light
              </button>
              <button
                type="button"
                onClick={() => setAcSun('sunny')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  acSun === 'sunny' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Very Sunny (+10%)
              </button>
            </div>
          </div>
          <NumberSliderInput
            id="ac-occupants"
            label="Regular Occupants in Room"
            value={acOccupants}
            onChange={setAcOccupants}
            min={1}
            max={12}
            step={1}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ac-kitchen"
              checked={acKitchen}
              onChange={(e) => setAcKitchen(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600"
            />
            <label htmlFor="ac-kitchen" className="text-xs font-semibold text-slate-700">
              Room is or includes a Kitchen (+4,000 BTU)
            </label>
          </div>
        </div>

        {acResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Air Conditioner Capacity</span>
            <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
              {acResult.recommendedBTU.toLocaleString()} BTU
            </div>
            <p className="text-xs text-slate-500 mt-2">Equivalent to {acResult.recommendedTons} Tons of Cooling</p>

            <div className="mt-8 pt-6 border-t border-slate-200 bg-white p-4 rounded-xl border text-xs text-slate-600 text-left">
              <span className="font-bold text-slate-900 block mb-1">Sizing Guideline:</span>
              <p>
                An undersized unit runs continuously without cooling properly; an oversized unit cools too fast without dehumidifying. A {acResult.recommendedBTU.toLocaleString()} BTU unit balances energy efficiency and moisture control.
              </p>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Wind}
            title="Enter Room Floor Area"
            subtitle="Specify the square footage of your space to calculate accurate BTU cooling capacity and tonnage."
          />
        )}
      </div>
    );
  }

  return null;
};
