import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMoveState } from '@/components/MoveProvider';
describe('MoveReady session actions', () => {
  it('annual smoke alarm check cannot pay twice in the demo year', () => {
    const {result}=renderHook(()=>useMoveState());
    act(()=>result.current.setOptIn(true));
    act(()=>result.current.earn('annual-alarm'));
    act(()=>result.current.earn('annual-alarm'));
    expect(result.current.active).toBe(500);
    expect(result.current.habits).toEqual(['annual-alarm']);
  });
  it('sensor battery check is an inclusive alternative to step rewards', () => {
    const {result}=renderHook(()=>useMoveState());
    act(()=>result.current.setOptIn(true));
    act(()=>result.current.earn('battery'));
    expect(result.current.active).toBe(500);
    expect(result.current.completed).toEqual([]);
  });
  it('cleaning uses only ActiveCredits and never MoveCredits', () => {
    const {result}=renderHook(()=>useMoveState());
    act(()=>result.current.complete('coverage'));
    act(()=>result.current.redeemCleaning());
    expect(result.current.active).toBe(50);
    expect(result.current.total).toBe(100);
    act(()=>result.current.redeemCleaning());
    expect(result.current.active).toBe(50);
  });
  it('completing a check never bypasses its crew witness', () => {
    const {result}=renderHook(()=>useMoveState());
    act(()=>result.current.complete('alarm'));
    expect(result.current.total).toBe(0);
    act(()=>result.current.confirm('alarm'));
    act(()=>result.current.complete('alarm'));
    expect(result.current.total).toBe(100);
  });
});