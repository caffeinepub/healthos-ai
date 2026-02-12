export function generateReframe(
  thought: string,
  evidenceFor: string[],
  evidenceAgainst: string[]
): string {
  if (evidenceAgainst.length > evidenceFor.length) {
    return `While I initially thought "${thought}", the evidence suggests a more balanced view: ${evidenceAgainst[0] || 'there are other perspectives to consider'}.`;
  }
  return `Instead of "${thought}", I can consider: ${evidenceAgainst[0] || 'alternative explanations exist'}.`;
}
