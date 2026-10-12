import React from 'react';
import { DiagnosticRiskGauge } from '../../types/dashboard';
import { ShieldAlert, Cpu, Database, Clock } from 'lucide-react';
import { Badge } from './Badge';

interface RiskGaugeProps {
  metrics: DiagnosticRiskGauge;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ metrics }) => {
  // SVG radial arc calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  // Let's use a 240 degree gauge arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * metrics.score) / 100;

  const getRiskColor = (score: number) => {
    if (score < 30) return { stroke: '#10b981', text: 'text-emerald-400', badge: 'green' as const };
    if (score < 65) return { stroke: '#f59e0b', text: 'text-amber-400', badge: 'amber' as const };
    return { stroke: '#f43f5e', text: 'text-rose-400', badge: 'rose' as const };
  };

  const riskVisual = getRiskColor(metrics.score);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
            Risk & Debt Gauge
          </span>
        </div>
        <Badge variant={riskVisual.badge} ping={metrics.overallRisk === 'High' || metrics.overallRisk === 'Critical'}>
          {metrics.overallRisk} Risk ({metrics.score}/100)
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Radial Arc Visual */}
        <div className="col-span-4 flex flex-col items-center justify-center relative py-1">
          <svg className="w-24 h-24 -rotate-135 transform" viewBox="0 0 100 100">
            {/* Background Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#27272a"
              strokeWidth="8"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={riskVisual.stroke}
              strokeWidth="8"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-xl font-bold font-mono tracking-tight ${riskVisual.text}`}>
              {metrics.score}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
              Index
            </span>
          </div>
        </div>

        {/* Detailed Risk Sub-Meters */}
        <div className="col-span-8 flex flex-col gap-2">
          {/* Tech Debt Delta */}
          <div className="flex items-center justify-between text-xs bg-zinc-950/60 border border-zinc-800/80 px-2.5 py-1.5 rounded">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Tech Debt Est.
            </span>
            <span
              className={`font-mono font-semibold ${
                metrics.technicalDebtDeltaMinutes < 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {metrics.technicalDebtDeltaMinutes < 0 ? '' : '+'}
              {metrics.technicalDebtDeltaMinutes} mins payoff
            </span>
          </div>

          {/* Concurrency Hazard Meter */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-rose-400" /> Concurrency Hazard
              </span>
              <span className="text-rose-400 font-semibold">{metrics.concurrencyHazardIndex}%</span>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.concurrencyHazardIndex}%` }}
              />
            </div>
          </div>

          {/* Memory Safety Score */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" /> Memory Safety
              </span>
              <span className="text-amber-400 font-semibold">{metrics.memorySafetyScore}%</span>
            </div>
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.memorySafetyScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
