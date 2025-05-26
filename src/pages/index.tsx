/**
 * This is a Next.js page.
 */
import * as React from 'react';
import {trpc, trpcStreamClient} from '../utils/trpc';


function StreamingExample() {
  // This is a streaming component that uses the `trpc` client to fetch data

  // state
  const [srvRunCount, setSrvRunCount] = React.useState<number | undefined>();
  const [data, setData] = React.useState<string[]>([]);
  const [error, setError] = React.useState<Error | null>(null);


  const streamForAFewSeconds = async () => {
    const iterable = await trpcStreamClient.iterable.query();
    const data: string[] = [];
    try {
      for await (const item of iterable) {
        if (item.t === '_tick') {
          data.push('' + item.i);
          setData([...data]);
        } else if (item.t === '_run') {
          setSrvRunCount(item.c);
        }
      }
    } catch (error: any) {
      // handle error
      setError(error);
      console.error('Error in streaming:', error);
    }
  }


  return (
    <div>
      <h2>Streaming Data:</h2>
      <h3>Server-side streams count: {srvRunCount ?? 0}</h3>
      <button onClick={streamForAFewSeconds}>Start Streaming</button>
      {error && <div style={{ color: 'red', fontSize: '1rem', outline: '1px solid red', padding: '1rem' }}>{error.message}</div>}
      <ul>
        {data?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}


export default function IndexPage() {
  // 💡 Tip: CMD+Click (or CTRL+Click) on `greeting` to go to the server definition
  const result = trpc.greeting.useQuery({ name: 'client' });

  if (!result.data) {
    return (
      <div style={styles}>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div style={styles}>

      {/* [REPRO] Streaming Component Example */}
      <StreamingExample />

      {/**
       * The type is defined and can be autocompleted
       * 💡 Tip: Hover over `data` to see the result type
       * 💡 Tip: CMD+Click (or CTRL+Click) on `text` to go to the server definition
       * 💡 Tip: Secondary click on `text` and "Rename Symbol" to rename it both on the client & server
       */}
      <h1>{result.data.text}</h1>
    </div>
  );
}

const styles = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
} as const;
