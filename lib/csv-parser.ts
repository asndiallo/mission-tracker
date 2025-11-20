import type { CSVImportTemplate } from "./supabase";

export interface ParsedTransaction {
  transaction_date: string;
  clearing_date: string | null;
  description: string;
  merchant: string | null;
  category: string | null;
  transaction_type: "expense" | "income" | "payment" | "transfer";
  amount: number;
  imported_from: string;
}

export interface BankParser {
  name: string;
  detect: (headers: string[]) => boolean;
  parse: (row: string[], headers: string[]) => ParsedTransaction | null;
}

// Helper to parse dates in various formats
function parseDate(dateStr: string, _format: string): string {
  // Common format: MM/DD/YYYY
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  // ISO format: YYYY-MM-DD (already correct)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  return dateStr;
}

// Helper to parse amount (handle various formats)
function parseAmount(amountStr: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = amountStr.replace(/[$,\s]/g, "");
  return Number.parseFloat(cleaned);
}

// Helper to determine transaction type based on description and category
function determineTransactionType(
  description: string,
  category: string | null,
  type: string | null,
  amount: number,
): "expense" | "income" | "payment" | "transfer" {
  const descLower = description.toLowerCase();
  const catLower = category?.toLowerCase() || "";
  const typeLower = type?.toLowerCase() || "";

  // Check for payment indicators
  const paymentKeywords = [
    "payment",
    "credit card payment",
    "ach deposit internet transfer",
    "autopay",
    "online payment",
    "bill payment",
    "loan payment",
    "mortgage payment",
  ];

  if (
    paymentKeywords.some((keyword) => descLower.includes(keyword)) ||
    typeLower === "payment" ||
    catLower === "payment"
  ) {
    return "payment";
  }

  // Check for transfer indicators
  const transferKeywords = [
    "transfer",
    "zelle",
    "venmo",
    "cash app",
    "paypal transfer",
  ];

  if (
    transferKeywords.some((keyword) => descLower.includes(keyword)) ||
    typeLower === "transfer"
  ) {
    return "transfer";
  }

  // Check for income (negative amounts in credit card context)
  // Credits, refunds, cashback, etc.
  if (amount < 0 || typeLower === "credit" || catLower.includes("credit")) {
    return "income";
  }

  // Default to expense
  return "expense";
}

// Bank-specific parsers
const AppleCardParser: BankParser = {
  name: "Apple Card",
  detect: (headers: string[]) => {
    const headerStr = headers.join(",").toLowerCase();
    return (
      headerStr.includes("transaction date") &&
      headerStr.includes("clearing date") &&
      headerStr.includes("purchased by")
    );
  },
  parse: (row: string[], headers: string[]) => {
    const getCol = (name: string) =>
      headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

    const transactionDateIdx = getCol("transaction date");
    const clearingDateIdx = getCol("clearing date");
    const descriptionIdx = getCol("description");
    const merchantIdx = getCol("merchant");
    const categoryIdx = getCol("category");
    const typeIdx = getCol("type");
    const amountIdx = getCol("amount");

    if (
      transactionDateIdx === -1 ||
      amountIdx === -1 ||
      descriptionIdx === -1
    ) {
      return null;
    }

    const description = row[descriptionIdx];
    const category = categoryIdx !== -1 ? row[categoryIdx] : null;
    const type = typeIdx !== -1 ? row[typeIdx] : null;
    const amount = parseAmount(row[amountIdx]);

    return {
      transaction_date: parseDate(row[transactionDateIdx], "MM/DD/YYYY"),
      clearing_date:
        clearingDateIdx !== -1
          ? parseDate(row[clearingDateIdx], "MM/DD/YYYY")
          : null,
      description,
      merchant: merchantIdx !== -1 ? row[merchantIdx] : null,
      category,
      transaction_type: determineTransactionType(
        description,
        category,
        type,
        amount,
      ),
      amount: Math.abs(amount), // Store as absolute value
      imported_from: "Apple Card",
    };
  },
};

const ChaseParser: BankParser = {
  name: "Chase",
  detect: (headers: string[]) => {
    const headerStr = headers.join(",").toLowerCase();
    return (
      (headerStr.includes("transaction date") ||
        headerStr.includes("post date")) &&
      headerStr.includes("description") &&
      headerStr.includes("chase")
    );
  },
  parse: (row: string[], headers: string[]) => {
    const getCol = (name: string) =>
      headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

    const transactionDateIdx =
      getCol("transaction date") !== -1
        ? getCol("transaction date")
        : getCol("post date");
    const descriptionIdx = getCol("description");
    const categoryIdx = getCol("category");
    const typeIdx = getCol("type");
    const amountIdx = getCol("amount");

    if (
      transactionDateIdx === -1 ||
      amountIdx === -1 ||
      descriptionIdx === -1
    ) {
      return null;
    }

    const description = row[descriptionIdx];
    const category =
      categoryIdx !== -1
        ? row[categoryIdx]
        : typeIdx !== -1
          ? row[typeIdx]
          : null;
    const type = typeIdx !== -1 ? row[typeIdx] : null;
    const amount = parseAmount(row[amountIdx]);

    return {
      transaction_date: parseDate(row[transactionDateIdx], "MM/DD/YYYY"),
      clearing_date: null,
      description,
      merchant: description, // Chase uses description as merchant
      category,
      transaction_type: determineTransactionType(
        description,
        category,
        type,
        amount,
      ),
      amount: Math.abs(amount),
      imported_from: "Chase",
    };
  },
};

const CapitalOneParser: BankParser = {
  name: "Capital One",
  detect: (headers: string[]) => {
    const headerStr = headers.join(",").toLowerCase();
    return (
      headerStr.includes("transaction date") &&
      headerStr.includes("debit") &&
      headerStr.includes("credit")
    );
  },
  parse: (row: string[], headers: string[]) => {
    const getCol = (name: string) =>
      headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

    const transactionDateIdx = getCol("transaction date");
    const postedDateIdx = getCol("posted date");
    const descriptionIdx = getCol("description");
    const categoryIdx = getCol("category");
    const debitIdx = getCol("debit");
    const creditIdx = getCol("credit");

    if (transactionDateIdx === -1 || descriptionIdx === -1) {
      return null;
    }

    // Capital One has separate debit/credit columns
    let amount = 0;
    if (debitIdx !== -1 && row[debitIdx]) {
      amount = parseAmount(row[debitIdx]);
    } else if (creditIdx !== -1 && row[creditIdx]) {
      amount = -parseAmount(row[creditIdx]); // Credits are negative
    }

    const description = row[descriptionIdx];
    const category = categoryIdx !== -1 ? row[categoryIdx] : null;

    return {
      transaction_date: parseDate(row[transactionDateIdx], "MM/DD/YYYY"),
      clearing_date:
        postedDateIdx !== -1
          ? parseDate(row[postedDateIdx], "MM/DD/YYYY")
          : null,
      description,
      merchant: description,
      category,
      transaction_type: determineTransactionType(
        description,
        category,
        null,
        amount,
      ),
      amount: Math.abs(amount),
      imported_from: "Capital One",
    };
  },
};

const NavyFederalParser: BankParser = {
  name: "Navy Federal",
  detect: (headers: string[]) => {
    const headerStr = headers.join(",").toLowerCase();
    return (
      headerStr.includes("date") &&
      headerStr.includes("description") &&
      (headerStr.includes("withdrawals") || headerStr.includes("deposits"))
    );
  },
  parse: (row: string[], headers: string[]) => {
    const getCol = (name: string) =>
      headers.findIndex((h) => h.toLowerCase().includes(name.toLowerCase()));

    const dateIdx = getCol("date");
    const descriptionIdx = getCol("description");
    const withdrawalsIdx = getCol("withdrawals");
    const depositsIdx = getCol("deposits");

    if (dateIdx === -1 || descriptionIdx === -1) {
      return null;
    }

    // Navy Federal has separate withdrawal/deposit columns
    let amount = 0;
    if (withdrawalsIdx !== -1 && row[withdrawalsIdx]) {
      amount = parseAmount(row[withdrawalsIdx]);
    } else if (depositsIdx !== -1 && row[depositsIdx]) {
      amount = -parseAmount(row[depositsIdx]); // Deposits are negative
    }

    const description = row[descriptionIdx];

    return {
      transaction_date: parseDate(row[dateIdx], "MM/DD/YYYY"),
      clearing_date: null,
      description,
      merchant: description,
      category: null,
      transaction_type: determineTransactionType(
        description,
        null,
        null,
        amount,
      ),
      amount: Math.abs(amount),
      imported_from: "Navy Federal",
    };
  },
};

// Registry of all bank parsers
const BANK_PARSERS: BankParser[] = [
  AppleCardParser,
  ChaseParser,
  CapitalOneParser,
  NavyFederalParser,
];

// Auto-detect bank from CSV headers
export function detectBank(headers: string[]): BankParser | null {
  for (const parser of BANK_PARSERS) {
    if (parser.detect(headers)) {
      return parser;
    }
  }
  return null;
}

// Parse CSV text into rows
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n");
  const rows: string[][] = [];

  for (const line of lines) {
    // Simple CSV parsing (handles quoted fields)
    const row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
}

// Parse CSV file with auto-detection
export function parseCSVFile(
  csvText: string,
  _userId: string,
): {
  transactions: ParsedTransaction[];
  detectedBank: string | null;
  headers: string[];
} {
  const rows = parseCSV(csvText);
  if (rows.length === 0) {
    return { transactions: [], detectedBank: null, headers: [] };
  }

  const headers = rows[0];
  const detectedParser = detectBank(headers);

  if (!detectedParser) {
    return { transactions: [], detectedBank: null, headers };
  }

  const transactions: ParsedTransaction[] = [];
  for (let i = 1; i < rows.length; i++) {
    const parsed = detectedParser.parse(rows[i], headers);
    if (parsed) {
      transactions.push(parsed);
    }
  }

  return {
    transactions,
    detectedBank: detectedParser.name,
    headers,
  };
}

// Parse CSV using a saved template
export function parseCSVWithTemplate(
  csvText: string,
  template: CSVImportTemplate,
): ParsedTransaction[] {
  const rows = parseCSV(csvText);
  if (rows.length === 0) {
    return [];
  }

  const transactions: ParsedTransaction[] = [];
  const mapping = template.column_mapping;

  // Start from index 1 to skip headers
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const description = row[mapping.description];
    const category = mapping.category ? row[mapping.category] : null;
    const amount =
      parseAmount(row[mapping.amount]) * template.amount_multiplier;

    const transaction: ParsedTransaction = {
      transaction_date: parseDate(
        row[mapping.transaction_date],
        template.date_format,
      ),
      clearing_date: mapping.clearing_date
        ? parseDate(row[mapping.clearing_date], template.date_format)
        : null,
      description,
      merchant: mapping.merchant ? row[mapping.merchant] : null,
      category,
      transaction_type: determineTransactionType(
        description,
        category,
        null,
        amount,
      ),
      amount: Math.abs(amount),
      imported_from: template.bank_name,
    };

    transactions.push(transaction);
  }

  return transactions;
}

// Get list of supported banks
export function getSupportedBanks(): string[] {
  return BANK_PARSERS.map((p) => p.name);
}
