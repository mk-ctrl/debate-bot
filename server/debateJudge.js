import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv"
dotenv.config();

const debatJudge = async (arguement) =>{
  const client = new InferenceClient(process.env.HF_TOKEN);

  const chatCompletion = await client.chatCompletion({
  provider: "auto",
  model: "Qwen/Qwen2-7B-Instruct",
  messages: [
    {
      role: "user",
      content: `
You are a judge. Score this argument on a scale of 0 to 10 for the following criteria:
- Relevance
- Logic
- Fallacy (state the name or "None")
- Clarity
- Evidence
- Persuasiveness
- Originality

Debate Topic:
"AI should not be allowed to make decisions in life-or-death situations."

Argument:
${arguement}

return Score=(Relevance*0.15+Logic*0.20+Fallacy*0.15+Clarity*0.10+Evidence*0.15+Persuasiveness*0.15+Originality*0.10).
      `,
    },
  ],
});

return(chatCompletion.choices[0].message.content);
}

export default debatJudge