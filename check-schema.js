// Quick script to inspect the actual products table columns in Supabase
const { createClient } = require("@supabase/supabase-js");

const url = "https://fincritbxiuorpatfqsr.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

if (!key) {
  console.error("Pass the service role key as an argument or set SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  // Query the information_schema to get actual column names
  const rpcResult = await supabase.rpc("", {});

  // Fallback: just try to select a single row and see what columns come back
  console.log("=== PRODUCTS TABLE ===");
  const products = await supabase.from("products").select().limit(1);
  if (products.error) {
    console.log("Error:", products.error.message);
    console.log("Details:", products.error.details);
    console.log("Hint:", products.error.hint);
  } else {
    console.log("Columns:", products.data?.length > 0 ? Object.keys(products.data[0]) : "No rows - cannot determine columns from data");
    console.log("Sample row:", JSON.stringify(products.data?.[0], null, 2));
  }

  // Also try querying the information_schema directly
  console.log("\n=== INFORMATION_SCHEMA QUERY ===");
  const schema = await supabase
    .from("information_schema.columns")
    .select("column_name, data_type, is_nullable")
    .eq("table_schema", "public")
    .eq("table_name", "products");

  if (schema.error) {
    // If information_schema isn't accessible via PostgREST, try raw SQL
    console.log("Cannot query information_schema via PostgREST, trying RPC...");
    
    // Try another approach - just query with specific column guesses
    console.log("\n=== COLUMN EXISTENCE TESTS ===");
    const tests = ["name", "title", "product_name", "image", "image_url", "img", "photo", "description", "details", "price", "amount", "category", "stock", "quantity"];
    for (const col of tests) {
      const result = await supabase.from("products").select(col).limit(1);
      console.log(`  ${col}: ${result.error ? "NOT FOUND" : "EXISTS"}`);
    }
  } else {
    console.log("Columns:");
    schema.data?.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });
  }
}

main().catch(console.error);
