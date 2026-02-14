import { describe, it, expect } from 'vitest';
import { selectWeightedRandom, getSegments, createSampleItems, WheelItem } from '@/lib/wheelUtils';

describe('selectWeightedRandom', () => {
  const items: WheelItem[] = [
    { id: '1', text: 'A', weight: 1, color: '#f00', enabled: true },
    { id: '2', text: 'B', weight: 1, color: '#0f0', enabled: true },
    { id: '3', text: 'C', weight: 1, color: '#00f', enabled: false },
  ];

  it('only selects from enabled items', () => {
    for (let i = 0; i < 50; i++) {
      const result = selectWeightedRandom(items, 'equal');
      expect(result.id).not.toBe('3');
    }
  });

  it('respects weights in weighted mode', () => {
    const weighted: WheelItem[] = [
      { id: '1', text: 'A', weight: 100, color: '#f00', enabled: true },
      { id: '2', text: 'B', weight: 1, color: '#0f0', enabled: true },
    ];
    let countA = 0;
    for (let i = 0; i < 500; i++) {
      if (selectWeightedRandom(weighted, 'weighted').id === '1') countA++;
    }
    expect(countA).toBeGreaterThan(400);
  });

  it('throws if no enabled items', () => {
    const disabled: WheelItem[] = [
      { id: '1', text: 'A', weight: 1, color: '#f00', enabled: false },
    ];
    expect(() => selectWeightedRandom(disabled, 'equal')).toThrow();
  });
});

describe('getSegments', () => {
  it('creates correct equal segments', () => {
    const items = createSampleItems();
    const segments = getSegments(items, 'equal');
    expect(segments.length).toBe(8);
    const totalAngle = segments.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0);
    expect(Math.abs(totalAngle - 360)).toBeLessThan(0.01);
  });

  it('creates correct weighted segments', () => {
    const items: WheelItem[] = [
      { id: '1', text: 'A', weight: 3, color: '#f00', enabled: true },
      { id: '2', text: 'B', weight: 1, color: '#0f0', enabled: true },
    ];
    const segments = getSegments(items, 'weighted');
    expect(segments[0].endAngle - segments[0].startAngle).toBe(270);
    expect(segments[1].endAngle - segments[1].startAngle).toBe(90);
  });
});
