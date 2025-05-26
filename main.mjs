import { OpenAI } from "openai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.LIARA_API_KEY,
});

async function getCurrentWeather(location, unit = "celsius") {
  try {
    const url = `https://wttr.in/${location}?format=j1`;
    const response = await axios.get(url);
    const data = response.data;

    const current = data.current_condition[0];
    const temperature = unit === "celsius" ? current.temp_C : current.temp_F;
    const condition = current.weatherDesc[0].value;

    return {
      location: location.charAt(0).toUpperCase() + location.slice(1),
      temperature: parseInt(temperature),
      unit: unit,
      condition: condition
    };
  } catch (error) {
    return { error: error.message };
  }
}

const tools = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and country, e.g. Tehran, Iran",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
];

const messages = [
  { role: "user", content: "What's the weather like in Tehran?" },
];

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4.1",
    messages,
    tools,
    tool_choice: "auto",
  });

  const argsRaw = completion.choices[0].message.tool_calls[0].function.arguments;
  const args = JSON.parse(argsRaw);

  const weather = await getCurrentWeather(
    args.location,
    args.unit || "celsius"
  );

  if (weather.error) {
    console.error(`❌ Error fetching weather: ${weather.error}`);
  } else {
    const unitSymbol = weather.unit === "celsius" ? "C" : "F";
    console.log(
      `🌤️ The weather in ${weather.location} is ${weather.temperature}°${unitSymbol} and ${weather.condition}.`
    );
  }
}

main();
