import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import withData from './WithData';

// @todo This will need to be dynamically switched?
const headers = { 'X-Tenant-Key': 'cygnus_fhc' };

const config = {
  link: new HttpLink({
    uri: 'http://app:8937/graph',
    headers,
    fetch,
  }),
};

export default withData(config);
