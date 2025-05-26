# 🌤️ Weather Assistant using LiaraAI + wttr.in API

This NodeJS script demonstrates how to use **OpenAI's function calling** capabilities to dynamically fetch real-time weather information from the free and public [wttr.in](https://wttr.in) weather API.

---

## 🚀 Features

- Integrates with Liara API via **function calling** (tool calls).
- Fetches **real-time weather** using the free `wttr.in` API.
- Supports both **Celsius** and **Fahrenheit** units.
- Auto-extracts relevant arguments from user messages via LLM.
- Simple, readable output in the terminal.

---


## 🧰 Running the app

```
git clone https://github.com/liara-cloud/nodejs-getting-started.git
```

```
cd nodejs-getting-started
```


```
git checkout ai
```


```bash
npm i 
```

```
mv .env.example .env
```

- set ENVs on `.env`

```
node main.mjs
```


