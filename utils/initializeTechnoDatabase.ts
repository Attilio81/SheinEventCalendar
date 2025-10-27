/**
 * Database Initialization Script for Techno Events
 *
 * Usage in browser console:
 * import { initializeTechnoDatabase } from '@/utils/initializeTechnoDatabase';
 * await initializeTechnoDatabase();
 *
 * Or directly:
 * npx ts-node utils/initializeTechnoDatabase.ts
 */

import { initializeTechnoEventsDatabase } from '@/lib/technoScraper';

export async function initializeTechnoDatabase() {
  try {
    console.log('🎵 Starting Techno Events Database Initialization...');
    console.log('This will populate Supabase with 21 real European techno festivals');
    console.log('It is safe to run multiple times - duplicates will be skipped');
    console.log('---');

    const count = await initializeTechnoEventsDatabase();

    console.log('---');
    console.log(`✅ SUCCESS! Initialized database with ${count} festivals`);
    console.log('📱 You can now see events in the Techno Events section');
    console.log('🌍 Festivals include: ADE, TIME WARP, AWAKENINGS, KAPPA, Q35 Warehouse, and more');

    return count;
  } catch (error) {
    console.error('❌ FAILED to initialize database');
    console.error('Error details:', error);
    console.log('💡 Make sure:');
    console.log('   1. You are logged in to the app');
    console.log('   2. Supabase RLS policies allow INSERT/UPDATE');
    console.log('   3. public_techno_events table exists');
    throw error;
  }
}

// Auto-run if this is the main module
if (typeof window !== 'undefined') {
  console.log('✨ Techno Database Initializer loaded');
  console.log('Run: initializeTechnoDatabase() to populate the database with 21 festivals');
  (window as any).initializeTechnoDatabase = initializeTechnoDatabase;
}
