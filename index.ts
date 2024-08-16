/* 
reverse inputpath outputpath: inputpath にあるファイルを受け取り、outputpath に inputpath の内容を逆にした新しいファイルを作成します。
copy inputpath outputpath: inputpath にあるファイルのコピーを作成し、outputpath として保存します。
duplicate-contents inputpath n: inputpath にあるファイルの内容を読み込み、その内容を複製し、複製された内容を inputpath に n 回複製します。
replace-string inputpath needle newstring: inputpath にあるファイルの内容から文字列 'needle' を検索し、'needle' の全てを 'newstring' に置き換えます。
*/

import { promises as fs } from "fs";
import * as readline from "readline";
import { dirname } from "path";

class FileManifulator {
  async reverse(inputPath: string, outputPath: string) {
    const contents = await fs.readFile(inputPath, "utf8");
    const outputPathDir = dirname(outputPath);

    const reversedContents = contents.split("").reverse().join("");

    try {
      await fs.mkdir(outputPathDir, { recursive: true });
      await fs.writeFile(outputPath, reversedContents);
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  async copy(inputPath: string, outputPath: string) {
    const outputPathDir = dirname(outputPath);

    try {
      await fs.mkdir(outputPathDir, { recursive: true });
      await fs.copyFile(inputPath, outputPath);
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  async duplicateContents(inputPath: string, n: number) {
    const contents = await fs.readFile(inputPath, "utf8");
    const duplicateContents = contents.repeat(n);

    try {
      await fs.writeFile(inputPath, duplicateContents);
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  async replaceString(inputPath: string, needle: string, newstring: string) {
    const contents = await fs.readFile(inputPath, "utf8");
    const replaceNeedleToNewString = contents.replace(needle, newstring);

    try {
      await fs.writeFile(inputPath, replaceNeedleToNewString);
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  executeCommand(command: string, args: string[]) {
    try {
      switch (command) {
        case "reverse":
          if (args.length !== 2) {
            throw new Error("reverse command requires exactly 2 arguments.");
          }
          this.reverse(args[0], args[1]);
          break;
        case "copy":
          if (args.length !== 2) {
            throw new Error("copy command requires exactly 2 arguments.");
          }
          this.copy(args[0], args[1]);
          break;
        case "duplicate-contents":
          if (args.length !== 2) {
            throw new Error(
              "duplicate-contents command requires exactly 2 arguments."
            );
          }
          const n = parseInt(args[1], 10);
          if (isNaN(n)) throw new Error("n should be a number.");
          this.duplicateContents(args[0], n);
          break;
        case "replace-string":
          if (args.length !== 3) {
            throw new Error(
              "replace-string command requires exactly 3 arguments."
            );
          }
          this.replaceString(args[0], args[1], args[2]);
          break;
        default:
          throw new Error("Unknown command.");
      }
    } catch (error) {
      console.error(error);
    }
  }
}

class CommandLineApp {
  private fileManifulator = new FileManifulator();

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("", (input) => {
      const [command, ...args] = input.split(" ");

      if (args.length < 2 || args.length > 3) {
        console.error("Error: Invalid prompt");
        rl.close();
        return;
      }

      this.fileManifulator.executeCommand(command, args);
      rl.close();
    });
  }
}

const app = new CommandLineApp();
app.start();
