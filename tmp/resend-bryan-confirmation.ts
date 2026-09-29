import 'dotenv/config';
import { confirmationTemplateData } from '../src/features/registration/lib/confirmation-email';
import { sendTemplate } from '../src/lib/resend';
async function main() {
 const to = 'bryan@cminds.co';
 process.env.CEIBA_EMAIL_ALLOWLIST = to;
 const { data, missing } = confirmationTemplateData({name:'Bryan',surname:'(PRUEBA)',events:['NIGHT'],origin:'quito'});
 if (missing.length) throw new Error('Missing event details');
 const result = await sendTemplate({to,template:'confirmation',data});
 console.log(JSON.stringify(result));
 if (result.status !== 'sent') process.exitCode=1;
}
main().catch(()=>{console.error('Confirmation test failed');process.exitCode=1;});
