import { Command, flags } from "@oclif/command";
import {
  DirScanReport,
  ImageParser,
  ImageTagsComparison,
} from "../util/image-parser";
import cli from "cli-ux";
import * as signal from "signale";
import * as fs from "fs";
import inquirer = require("inquirer");
const chalk = require("chalk");
const CFonts = require("cfonts");

export default class ScanDir extends Command {
  static description = "Scan a directory with images images";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "directory", description: "Path to directory" }];

  options = {
    scope: "exif-util",
  };

  async run() {
    this.welcome();

    // Args and argv
    const { argv, args } = this.parse(ScanDir);

    let dir = args.directory;
    if (!args.directory) {
      const sig = new signal.Signale({
        ...this.options,
      });
      sig.warn(`Directory not provided in args. Please choose..`);
      this.showSeparator();
      this.log("\n");
      const homedir: string = require("os").homedir();
      inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));
      await inquirer
        .prompt([
          {
            type: "fuzzypath",
            name: "directory",
            excludePath: (nodePath: string) => nodePath.includes("."),
            excludeFilter: (nodePath: string) => nodePath.includes("."),
            itemType: "directory",
            rootPath: homedir,
            message: "Select a target directory for scanning:",
            suggestOnly: false,
            depthLimit: 4,
          },
        ])
        .then((response) => {
          dir = response.directory;
          this.log("\n");
          this.showSeparator();
        })
        .catch((err) => {
          this.catch(err);
        });
    }

    if (dir) {
      // Validate directory
      this.validateDir(dir);

      // Initialize parser
      const parser = await this.initializeParser(dir);

      // File list
      const files = this.prepFileList(parser);

      // Compare
      const results = await this.compareImageTags(parser, files);

      // Show report
      let showReport = true;
      this.showSeparator();
      this.log("\n");
      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "showReport",
            message: "Show scan report?",
            default: true,
          },
        ])
        .then((response) => {
          showReport = response.showReport;
          if (showReport) {
            this.log("\n");
            this.showSeparator();
          }
        });

      if (showReport) {
        const report = parser.getScanReport(results, 10);
        this.showReportTree(report);
      }

      // Show comparison
      let showComparison = true;
      this.log("\n");
      this.showSeparator();
      this.log("\n");
      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "showComparison",
            message: "Show comparison table?",
            default: true,
          },
        ])
        .then((response) => {
          showComparison = response.showComparison;
          if (showComparison) {
            this.log("\n");
            this.showSeparator();
          }
        });

      if (showComparison) {
        console.table(results);
      }

      this.log("\n");
      this.showSeparator();
      const sig = new signal.Signale({
        ...this.options,
      });
      sig.complete("Directory scan complete. Exiting now...");
      this.log("\n");
      parser.destroy();
    }
  }

  // Main steps

  // Step 0
  welcome(): void {
    console.clear();
    this.log("\n");
    CFonts.say("exif-util", {
      font: "simple", // define the font face
      align: "left", // define text alignment
      colors: ["green"], // define all colors
      background: "transparent", // define the background color, you can also use `backgroundColor` here as key
      letterSpacing: 1, // define letter spacing
      lineHeight: 1, // define the line height
      space: false, // define if the output text should have empty lines on top and on the bottom
      maxLength: "10", // define how many character can be on one line
      gradient: false, // define your two gradient colors
      independentGradient: false, // define if you want to recalculate the gradient for each new line
      transitionGradient: false, // define if this is a transition between colors directly
      env: "node", // define the environment CFonts is being executed in
    });
    this.log("\n");
    this.log(
      chalk.bgGreen.black(`  exif-util version ${this.config.version}   `)
    );
    this.log("\n");
    this.showSeparator();
  }
  // Step 1
  validateDir(dir: string) {
    const sig = new signal.Signale({
      ...this.options,
    });
    sig.start(`Preparing to scan directory at ${dir}`);
    sig.await("Checking directory...");
    if (fs.existsSync(dir)) {
      sig.success("Directory exists");
    } else {
      throw new Error("Directory does not exist");
    }
  }

  // Step 2
  async initializeParser(dir: string): Promise<ImageParser> {
    const sig = new signal.Signale({
      ...this.options,
    });
    sig.await("Initializing parser...");
    const parser = new ImageParser(dir);
    await parser.init();
    sig.success("Parser initialized");
    return parser;
  }

  // Step 3
  prepFileList(parser: ImageParser): string[] {
    const sig = new signal.Signale({
      ...this.options,
    });
    sig.await("Reading files...");

    const files = parser.files;
    if (files.length >= 1) {
      sig.success("File list ready");
    } else {
      throw new Error("Directory is empty");
    }
    return files;
  }

  // Step 4
  async compareImageTags(
    parser: ImageParser,
    files: string[]
  ): Promise<ImageTagsComparison[]> {
    const sig = new signal.Signale({
      ...this.options,
    });
    sig.watch("Comparing tags...");
    this.showSeparator();

    const results: ImageTagsComparison[] = [];
    const customBar = cli.progress({
      format: "PROGRESS | {bar} | {value}/{total} Image Pairs",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
    });
    this.log("\n");
    customBar.start(files.length / 2, 0);
    for (let index = 0; index < files.length; index += 2) {
      const tags1 = await parser.getImageTags(files[index]);
      const tags2 = await parser.getImageTags(files[index + 1]);
      const result = parser.compareImageTags(tags1, tags2);
      delete result["img1Tags"];
      delete result["img2Tags"];
      results.push(result);
      customBar.increment();
    }
    customBar.stop();
    this.log("\n");
    this.showSeparator();
    sig.success("Finished comparison");
    return results;
  }

  // Step 5
  private showReportTree(report: DirScanReport): void {
    const sig = new signal.Signale({
      ...this.options,
    });
    sig.await("Generating report...");
    const tree = cli.tree();
    tree.insert(`Images Scanned: ${report.imagesScanned}`);
    tree.insert(`Pairs Scanned: ${report.imagePairsScanned}`);
    tree.insert(`Pairs With Identical Tags: ${report.pairsWithIdenticalTags}`);
    tree.insert(`Pairs With Different Tags: ${report.pairsWithDifferentTags}`);
    tree.insert(`Min Longitude: ${report.minLong} degrees`);
    tree.insert(`Max Longitude: ${report.maxLong} degrees`);
    tree.insert(`Average Longitude Delta: ${report.avgLonDelta} degrees`);
    tree.insert(`Min Latitude: ${report.minLat} degrees`);
    tree.insert(`Max Latitude: ${report.maxLat} degrees`);
    tree.insert(`Average Latitude Delta: ${report.avgLatDelta} degrees`);
    tree.insert(`Min Altitude: ${report.minAlt} degrees`);
    tree.insert(`Max Altitude: ${report.maxAlt} degrees`);
    tree.insert(`Average Altitude Delta: ${report.avgAltDelta} degrees`);
    tree.insert(`Min DateTime: ${report.minDateTime} degrees`);
    tree.insert(`Max DateTime: ${report.maxDateTime} degrees`);
    tree.insert(`Average DateTime Delta: ${report.avgDateTimeDelta} seconds`);
    sig.success("Report ready");
    this.showSeparator();
    this.log("\n");
    this.log("Scan Report");
    tree.display();
  }

  // Helper
  private showSeparator(): void {
    this.log("-------------------------");
  }

  async catch(error: any) {
    const sig = new signal.Signale({
      ...this.options,
    });

    this.log("\n");
    sig.error(error);
    this.exit(1);
  }
}
