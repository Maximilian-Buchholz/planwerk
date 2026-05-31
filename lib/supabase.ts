import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptwfejnmgcfleoghbizy.supabase.co";
const supabaseKey = "sb_publishable_CMo8B3hBGGrF3PoV7jqEwg_gSe28PxZ";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
