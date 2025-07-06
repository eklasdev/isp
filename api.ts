
import type { UserData } from './types.ts';

interface ApiResponse {
  success: boolean;
  data: UserData;
  error: string | null;
}

// Parses the text content of users.txt into a Map of username -> password.
const parseUsersFile = (text: string): Map<string, string> => {
    const usersMap = new Map<string, string>();
    const lines = text.split('\n');
    let currentUser: string | null = null;

    for (const line of lines) {
        const userMatch = line.match(/^User:\s*(\S+)/);
        if (userMatch) {
            currentUser = userMatch[1];
            continue;
        }

        const passMatch = line.match(/^Pass:\s*(\S+)/);
        if (passMatch && currentUser) {
            usersMap.set(currentUser, passMatch[1]);
            currentUser = null; // Reset for the next User/Pass pair
        }
    }
    return usersMap;
};

// Fetches the users.txt file and returns the parsed credentials map.
export const fetchAndParseUsers = async (): Promise<Map<string, string>> => {
    try {
        const response = await fetch('https://gist.githubusercontent.com/eklasdev/bf35060d8079b6c6c5a7d4c5517507d8/raw/users.txt');
        if (!response.ok) {
            throw new Error(`Failed to fetch users.txt: ${response.statusText}`);
        }
        const text = await response.text();
        return parseUsersFile(text);
    } catch (error) {
        console.error("Error fetching or parsing users file:", error);
        throw error;
    }
};

// Fetches data for a specific user given a username and password.
// export const fetchUserData = async (username: string, password: string): Promise<UserData> => {
//   const apiUrl = `https://api-internet-x035.onrender.com/scrape?username=${username}&password=${password}`;

//   try {
//     const response = await fetch(apiUrl, {
//         headers: {
//             'Accept': 'application/json',
//         }
//     });

//     if (!response.ok) {
//       throw new Error(`Network request failed: ${response.status} ${response.statusText}`);
//     }

//     const result: ApiResponse = await response.json();

//     if (result.success && result.data) {
//       return result.data;
//     } else {
//       throw new Error(result.error || `Failed to fetch data for user ${username}.`);
//     }
//   } catch (error) {
//     console.error(`Error fetching user data for ${username}:`, error);
//     if (error instanceof Error) {
//         throw new Error(error.message);
//     }
//     throw new Error('An unknown error occurred while fetching data.');
//   }
// };

export const fetchUserData = async (username: string, password: string): Promise<UserData> => {
  const primaryUrl = `https://eklas-internet.eklasjs.workers.dev/?username=${username}&password=${password}`;
  const secondaryUrl = `https://api-internet-x035.onrender.com/scrape?username=${username}&password=${password}`;

  const tryFetch = async (url: string): Promise<ApiResponse> => {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    // Validate that it's proper JSON and conforms to expected structure
    const result = await response.json();
    if (typeof result !== 'object' || !('success' in result)) {
      throw new Error(`Invalid response format from ${url}`);
    }

    return result as ApiResponse;
  };

  try {
    const result = await tryFetch(primaryUrl);
    if (result.success && result.data) return result.data;
    throw new Error(result.error || 'Primary API returned failure.');
  } catch (primaryError) {
    console.warn(`Primary API failed, switching to secondary. Reason: ${primaryError}`);

    try {
      const result = await tryFetch(secondaryUrl);
      if (result.success && result.data) return result.data;
      throw new Error(result.error || 'Secondary API returned failure.');
    } catch (secondaryError) {
      console.error(`Both APIs failed. Last error:`, secondaryError);
      if (secondaryError instanceof Error) {
        throw new Error(secondaryError.message);
      }
      throw new Error('Unknown error occurred while fetching user data.');
    }
  }
};
