import { RequestHandler } from "express";
import { z } from "zod";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs/promises";
import * as os from "os";

const executeCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
  input: z.string().optional(),
});

const terminalCommandSchema = z.object({
  command: z.string(),
  workingDirectory: z.string().optional(),
});

const joseyQuerySchema = z.object({
  message: z.string(),
  context: z
    .object({
      fileContent: z.string().optional(),
      fileName: z.string().optional(),
      language: z.string().optional(),
    })
    .optional(),
});

// Code execution handler
export const executeCode: RequestHandler = async (req, res) => {
  try {
    const { code, language, input } = executeCodeSchema.parse(req.body);

    let result: { output: string; error?: string; executionTime: number };
    const startTime = Date.now();

    switch (language.toLowerCase()) {
      case "javascript":
      case "js":
        result = await executeJavaScript(code, input);
        break;
      case "python":
      case "py":
        result = await executePython(code, input);
        break;
      case "typescript":
      case "ts":
        result = await executeTypeScript(code, input);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Language ${language} is not supported yet`,
        });
    }

    result.executionTime = Date.now() - startTime;

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Terminal command handler
export const executeTerminalCommand: RequestHandler = async (req, res) => {
  try {
    const { command, workingDirectory = process.cwd() } =
      terminalCommandSchema.parse(req.body);

    const result = await executeShellCommand(command, workingDirectory);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Josey AI assistant handler
export const joseyQuery: RequestHandler = async (req, res) => {
  try {
    const { message, context } = joseyQuerySchema.parse(req.body);

    // In a real implementation, this would call OpenAI API
    const response = await generateJoseyResponse(message, context);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Code execution implementations
async function executeJavaScript(
  code: string,
  input?: string,
): Promise<{ output: string; error?: string; executionTime: number }> {
  return new Promise((resolve) => {
    // Create a sandboxed execution environment
    const wrappedCode = `
      const console = {
        log: (...args) => process.stdout.write(args.join(' ') + '\\n'),
        error: (...args) => process.stderr.write(args.join(' ') + '\\n'),
        warn: (...args) => process.stdout.write('⚠️ ' + args.join(' ') + '\\n'),
        info: (...args) => process.stdout.write('ℹ️ ' + args.join(' ') + '\\n'),
      };
      
      try {
        ${code}
      } catch (error) {
        console.error('Runtime Error:', error.message);
      }
    `;

    const child = spawn("node", ["-e", wrappedCode], {
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 10000, // 10 second timeout
    });

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.on("close", (code) => {
      resolve({
        output:
          output || (error ? "" : "Code executed successfully (no output)"),
        error: error || undefined,
        executionTime: 0,
      });
    });

    child.on("error", (err) => {
      resolve({
        output: "",
        error: `Execution error: ${err.message}`,
        executionTime: 0,
      });
    });
  });
}

async function executePython(
  code: string,
  input?: string,
): Promise<{ output: string; error?: string; executionTime: number }> {
  return new Promise((resolve) => {
    const child = spawn("python3", ["-c", code], {
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 10000,
    });

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.on("close", (code) => {
      resolve({
        output:
          output || (error ? "" : "Code executed successfully (no output)"),
        error: error || undefined,
        executionTime: 0,
      });
    });

    child.on("error", (err) => {
      resolve({
        output: "",
        error: `Python execution error: ${err.message}. Make sure Python is installed.`,
        executionTime: 0,
      });
    });
  });
}

async function executeTypeScript(
  code: string,
  input?: string,
): Promise<{ output: string; error?: string; executionTime: number }> {
  try {
    // For TypeScript, we'll transpile to JavaScript first
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "ide-ts-"));
    const tsFile = path.join(tempDir, "temp.ts");
    const jsFile = path.join(tempDir, "temp.js");

    await fs.writeFile(tsFile, code);

    return new Promise((resolve) => {
      // Compile TypeScript
      const tsc = spawn(
        "npx",
        ["tsc", tsFile, "--outDir", tempDir, "--target", "ES2020"],
        {
          stdio: ["pipe", "pipe", "pipe"],
        },
      );

      let compileError = "";

      tsc.stderr.on("data", (data) => {
        compileError += data.toString();
      });

      tsc.on("close", async (code) => {
        if (code !== 0) {
          resolve({
            output: "",
            error: `TypeScript compilation error: ${compileError}`,
            executionTime: 0,
          });
          return;
        }

        // Execute compiled JavaScript
        try {
          const compiledCode = await fs.readFile(jsFile, "utf8");
          const result = await executeJavaScript(compiledCode, input);

          // Clean up temp files
          await fs.rm(tempDir, { recursive: true, force: true });

          resolve(result);
        } catch (err) {
          resolve({
            output: "",
            error: `TypeScript execution error: ${err instanceof Error ? err.message : "Unknown error"}`,
            executionTime: 0,
          });
        }
      });
    });
  } catch (err) {
    return {
      output: "",
      error: `TypeScript setup error: ${err instanceof Error ? err.message : "Unknown error"}`,
      executionTime: 0,
    };
  }
}

async function executeShellCommand(
  command: string,
  workingDirectory: string,
): Promise<{ output: string; error?: string }> {
  return new Promise((resolve) => {
    // Security: Only allow safe commands
    const safeCommands = [
      "ls",
      "pwd",
      "echo",
      "cat",
      "grep",
      "find",
      "wc",
      "head",
      "tail",
      "npm",
      "node",
      "python",
      "pip",
    ];
    const commandParts = command.trim().split(" ");
    const baseCommand = commandParts[0];

    if (!safeCommands.includes(baseCommand)) {
      resolve({
        output: "",
        error: `Command '${baseCommand}' is not allowed for security reasons`,
      });
      return;
    }

    const child = spawn(baseCommand, commandParts.slice(1), {
      cwd: workingDirectory,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30000, // 30 second timeout
    });

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", (code) => {
      resolve({
        output: output || `Command executed (exit code: ${code})`,
        error: error || undefined,
      });
    });

    child.on("error", (err) => {
      resolve({
        output: "",
        error: `Command error: ${err.message}`,
      });
    });
  });
}

async function generateJoseyResponse(
  message: string,
  context?: any,
): Promise<{ content: string; type: string }> {
  // Mock Josey responses - in a real implementation, this would call OpenAI API
  const responses = {
    explain: [
      "Let me break down this code for you step by step:",
      "This code is doing the following:",
      "Here's what's happening in this code:",
      "I'll explain the key parts of this code:",
    ],
    debug: [
      "I can see a potential issue in your code. Here's what might be wrong:",
      "Let me help you debug this. I notice:",
      "I found some issues that could be causing problems:",
      "Here are the debugging suggestions:",
    ],
    optimize: [
      "Here are some ways to optimize this code:",
      "I can suggest several performance improvements:",
      "This code can be made more efficient by:",
      "Consider these optimization strategies:",
    ],
    generate: [
      "I'll help you generate the code you need:",
      "Here's a code snippet that should work:",
      "Let me create that for you:",
      "I can generate this code for you:",
    ],
  };

  // Determine response type based on message content
  let responseType = "text";
  let responseArray = responses.explain;

  if (
    message.toLowerCase().includes("debug") ||
    message.toLowerCase().includes("error")
  ) {
    responseType = "debug";
    responseArray = responses.debug;
  } else if (
    message.toLowerCase().includes("optimize") ||
    message.toLowerCase().includes("improve")
  ) {
    responseType = "optimize";
    responseArray = responses.optimize;
  } else if (
    message.toLowerCase().includes("generate") ||
    message.toLowerCase().includes("create")
  ) {
    responseType = "generate";
    responseArray = responses.generate;
  }

  const baseResponse =
    responseArray[Math.floor(Math.random() * responseArray.length)];

  // Add context-specific suggestions
  let contextualResponse = baseResponse;

  if (context?.language) {
    contextualResponse += `\n\nFor ${context.language}, I recommend:`;

    switch (context.language.toLowerCase()) {
      case "javascript":
        contextualResponse +=
          "\n• Use modern ES6+ features like arrow functions and destructuring\n• Consider adding error handling with try-catch blocks\n• Use const/let instead of var for better scoping";
        break;
      case "python":
        contextualResponse +=
          "\n• Follow PEP 8 style guidelines\n• Use type hints for better code documentation\n• Consider using list comprehensions for cleaner code";
        break;
      case "typescript":
        contextualResponse +=
          "\n• Leverage TypeScript's type system for better safety\n• Use interfaces for object shapes\n• Enable strict mode for better error catching";
        break;
    }
  }

  if (context?.fileContent && responseType === "debug") {
    contextualResponse +=
      "\n\nLooking at your code, check for:\n• Syntax errors\n• Undefined variables\n• Missing imports or dependencies\n• Incorrect function calls";
  }

  return {
    content: contextualResponse,
    type: responseType,
  };
}
