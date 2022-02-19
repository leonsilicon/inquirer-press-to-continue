import { execaCommandSync as exec } from 'execa';
import { copyPackageFiles } from 'lion-system';

exec('tsc');
exec('tsc-alias');
copyPackageFiles();
