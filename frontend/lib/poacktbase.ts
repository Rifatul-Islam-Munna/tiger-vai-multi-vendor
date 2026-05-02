
import PocketBase from 'pocketbase';
import { QueryClient } from '@tanstack/react-query';
import { AmIAuthenticated } from '@/actions/auth';
// TODO: have to call useQueryClient() to the login and logout for revalidation
// Store QueryClient instance
let queryClientInstance: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  queryClientInstance = client;
};

const callAuthFnFromNestjsBackend = async (url: string, options: RequestInit): Promise<RequestInit> => {
  if (!queryClientInstance) {
    throw new Error('QueryClient not initialized');
  }

  // ✅ Access cache directly (no hooks!)
  const cachedAuth = queryClientInstance.getQueryData(['get-auth-data']);

  if (cachedAuth && (cachedAuth as any).data === true) {
    console.log('✅ Auth cached, skipping validation');
    return options;
  }

  // ❌ Cache miss or invalid - fetch fresh data
  console.log('🔄 No valid cache, fetching auth...');
  
  try {
    const authData = await queryClientInstance.fetchQuery({
      queryKey: ['get-auth-data'],
      queryFn: ()=>AmIAuthenticated(), // calling it from nextjs server action so that backend url doesn't expose 
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    });

    if (!authData?.data) {
      throw new Error('Authentication failed');
    }

    console.log('✅ Auth validated and cached');
    return options;

  } catch (error) {
    console.error('❌ Auth error:', error);
    throw error; // Abort PocketBase request
  }
};

const pb = new PocketBase('https://multi-vendor-pocketbase.pixs1x.easypanel.host');
pb.beforeSend = callAuthFnFromNestjsBackend;

export default pb;
