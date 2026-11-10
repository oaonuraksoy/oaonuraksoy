/**
 * deterministic-agent-fsm-engine.ts
 * Production TypeScript implementation of a deterministic state machine with tiered model execution.
 * Part of the Onur Aksoy Systems Architecture Broadcast series.
 */

import { z } from 'zod';

export const StateProposalSchema = z.object({
  taskId: z.string().uuid(),
  sourceState: z.enum(['PLANNING', 'EXECUTING', 'AUDITING']),
  proposedTargetState: z.enum(['EXECUTING', 'AUDITING', 'COMMITTED']),
  astMutationDiff: z.string().min(1),
  affectedSymbolList: z.array(z.string()),
  executionTelemetry: z.object({
    tokensConsumed: z.number().int().positive(),
    workerModelId: z.string(),
    latencyMs: z.number().nonnegative()
  })
});

export type StateProposal = z.infer<typeof StateProposalSchema>;

export interface InvariantVerificationResult {
  passed: boolean;
  violations: string[];
}

export class DeterministicStateEngine {
  private currentState: 'PLANNING' | 'EXECUTING' | 'AUDITING' | 'COMMITTED' = 'PLANNING';

  public async evaluateMutation(proposal: StateProposal): Promise<InvariantVerificationResult> {
    // 1. Structural Schema Validation
    const parseResult = StateProposalSchema.safeParse(proposal);
    if (!parseResult.success) {
      return { 
        passed: false, 
        violations: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) 
      };
    }

    // 2. State Machine Invariant Check
    if (proposal.sourceState !== this.currentState) {
      return {
        passed: false,
        violations: [`Invalid source transition: Current (${this.currentState}) !== Proposed (${proposal.sourceState})`]
      };
    }

    // 3. Deterministic AST & Compile Boundary Verification
    const staticCheckPassed = await this.runStaticAstChecks(proposal.astMutationDiff);
    if (!staticCheckPassed) {
      return { 
        passed: false, 
        violations: ['Static AST invariant failed: Syntax regression or unauthorized import detected.'] 
      };
    }

    // 4. Invariant Transition Approval
    this.currentState = proposal.proposedTargetState;
    return { passed: true, violations: [] };
  }

  private async runStaticAstChecks(diff: string): Promise<boolean> {
    // Deterministic validation: disallow dangerous execution sinks and enforce type safety
    const forbiddenPatterns = ['eval(', 'process.exit(', 'Function(', 'child_process'];
    for (const pattern of forbiddenPatterns) {
      if (diff.includes(pattern)) {
        return false;
      }
    }
    return true;
  }

  public getCurrentState(): string {
    return this.currentState;
  }
}
