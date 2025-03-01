import { generateText } from 'ai';

import { o3MiniModel, applyMiddleware } from './ai/providers';
import { systemPrompt, feedbackOutputPrompt } from './prompt';

export async function generateFeedback({
  query,
  numQuestions = 3,
}: {
  query: string;
  numQuestions?: number;
}) {
  const userFeedback = await generateText({
    model: applyMiddleware(o3MiniModel),
    system: systemPrompt(),
    prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>` + `\n\n${feedbackOutputPrompt()}`,
    // schema: z.object({
    //   questions: z
    //     .array(z.string())
    //     .describe(
    //       `Follow up questions to clarify the research direction, max of ${numQuestions}`,
    //     ),
    // }),
  });

  return JSON.parse(userFeedback.text).questions.slice(0, numQuestions);
}
