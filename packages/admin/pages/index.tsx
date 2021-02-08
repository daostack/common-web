import { NextPage } from 'next';
import { withSidebar } from '../hoc/withSidebar';

const IndexPage: NextPage = () => {
  return (
    <div>
      Index Page
    </div>
  );
}

export default withSidebar(IndexPage);