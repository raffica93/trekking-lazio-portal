export interface SupabaseRuntimeConfig {
  supabaseUrl: string;
  supabasePublishableKey: string;
}

declare global {
  interface Window {
    __TREKKING_LAZIO_CONFIG__?: Partial<SupabaseRuntimeConfig>;
  }
}

const runtimeConfig = globalThis.window?.__TREKKING_LAZIO_CONFIG__;

export const supabaseRuntimeConfig: SupabaseRuntimeConfig = {
  supabaseUrl: runtimeConfig?.supabaseUrl?.trim() ?? '',
  supabasePublishableKey: runtimeConfig?.supabasePublishableKey?.trim() ?? ''
};

export const isSupabaseConfigured = Boolean(
  supabaseRuntimeConfig.supabaseUrl && supabaseRuntimeConfig.supabasePublishableKey
);
