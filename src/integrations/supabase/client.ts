// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iilbczoanafeqzjqovjb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbGJjem9hbmFmZXF6anFvdmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzAzMzEsImV4cCI6MjA1OTgwNjMzMX0.bFE7xLdOURKvfIHIzrTYJPWhCI08SvDhgsen2OwK2_k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);