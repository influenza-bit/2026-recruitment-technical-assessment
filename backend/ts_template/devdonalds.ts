import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: cookbookEntry[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  if (!recipeName) return null;

  let s = recipeName;

  // Replace hyphens and underscores with spaces
  s = s.replace(/[-_]/g, " ");

  // Remove all characters except letters and spaces
  s = s.replace(/[^a-zA-Z ]/g, "");

  // Convert to lowercase
  s = s.toLowerCase();

  // Split into words 
  const words = s.split(" ").filter(word => word.length > 0);

  // Capitalise first letter of each word
  const capitalisedWords = words.map(w =>
    w.charAt(0).toUpperCase() + w.slice(1)
  );

  // Finally join all words
  const result = capitalisedWords.join(" ");

  if (result.length === 0) return null;

  return result;
};

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const entry = req.body;

  // 1. type must be "recipe" or "ingredient"
  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    res.status(400).send("invalid type");
    return;
  }

  // 2. name must be unique
  const exists = cookbook.some(e => e.name === entry.name);
  if (exists) {
    res.status(400).send("duplicate name");
    return;
  }

  if (entry.type === "ingredient") {
    // 3. cookTime must be >= 0
    if (typeof entry.cookTime !== "number" || entry.cookTime < 0) {
      res.status(400).send("invalid cookTime");
      return;
    }

    cookbook.push(entry);
    res.status(200).send();
    return;
  }

  if (entry.type === "recipe") {
    // requiredItems must exist and be an array
    if (!Array.isArray(entry.requiredItems)) {
      res.status(400).send("invalid requiredItems");
      return;
    }

    // 4. requiredItems must not contain duplicate names
    const names = entry.requiredItems.map((item: any) => item.name);
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
      res.status(400).send("duplicate requiredItems");
      return;
    }

    cookbook.push(entry);
    res.status(200).send();
    return;
  }
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
