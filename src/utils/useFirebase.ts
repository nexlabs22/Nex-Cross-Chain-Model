import { useEffect, useRef, useState } from 'react';
import { database } from './firebase';
import { getDatabase, ref, onValue } from 'firebase/database';


export const useFirebaseDatabase = (path: string) => {
    const [data, setData] = useState<any>(null);
  
    useEffect(() => {
      
    }, [])
    
  
    return data; // Return only the data
  };
  