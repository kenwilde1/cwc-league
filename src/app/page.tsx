import { Fixtures } from './components/Fixtures';

import { Header } from './components/Header';
import { Table } from './components/Table';

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-slate-darker text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className='font-semibold text-lg'>Group Stage Fixtures</h2>
          <Fixtures />

          <div className='font-semibold text-lg py-4'>Latest update: tournament_not_started</div>
          <Table />
        </div>
      </div>
    </>
  );
}
