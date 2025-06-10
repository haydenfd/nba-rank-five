interface PlayerCardPropsInterface {
    id: string;
    name: string;
    ppg: string;
    code?: string;
    color?: string;
}

interface CircularImagePropsInterface {
    src: string;
    alt: string;
    size?: string;
    fit?: 'contain' | 'cover' | 'scale-down';
  }
  
export {
    CircularImagePropsInterface,
    PlayerCardPropsInterface,
}