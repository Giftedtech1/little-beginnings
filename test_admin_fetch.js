import { getStudents, getParents } from './src/services/studentService.js';
import { getAllProfiles } from './src/services/authService.js';
import { getPendingResults, getAdminResultsHistory } from './src/services/resultService.js';

async function test() {
  try {
    console.log('Fetching students...');
    await getStudents();
    console.log('Students success');
  } catch(e) { console.error('Students error:', e); }

  try {
    console.log('Fetching parents...');
    await getParents();
    console.log('Parents success');
  } catch(e) { console.error('Parents error:', e); }

  try {
    console.log('Fetching all profiles...');
    await getAllProfiles();
    console.log('Profiles success');
  } catch(e) { console.error('Profiles error:', e); }

  try {
    console.log('Fetching pending results...');
    await getPendingResults();
    console.log('Pending results success');
  } catch(e) { console.error('Pending results error:', e); }

  try {
    console.log('Fetching history results...');
    await getAdminResultsHistory();
    console.log('History results success');
  } catch(e) { console.error('History results error:', e); }
}

test();
