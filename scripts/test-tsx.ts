import * as dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
console.log("OpenAI imported!");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OpenAI instantiated!");
