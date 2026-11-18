// Real implementations. Fill these in only once the backend marks the feature ready.
import type { StudyLandingInfo, StudyRow } from '@contract/database.types';
import { RPC, TABLES } from '@contract/database.types';
import { supabase } from '@/lib/supabase';

export async function getStudyBySourceCode(code: string): Promise<StudyLandingInfo | null> {
  const { data, error } = await supabase.rpc(RPC.get_study_by_source_code, { p_code: code });
  if (error) throw error;
  return (data as StudyLandingInfo | null) ?? null;
}

export async function listMyStudies(): Promise<StudyRow[]> {
  const { data, error } = await supabase.from(TABLES.studies).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as StudyRow[];
}
