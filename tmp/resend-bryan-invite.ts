import 'dotenv/config';
import { inviteTemplateData } from '../src/features/registration/lib/invite-email';
import { sendTemplate } from '../src/lib/resend';
async function main() {
 const to = 'bryan@cminds.co';
 process.env.CEIBA_EMAIL_ALLOWLIST = to;
 const {data,missing} = inviteTemplateData({host:'Equipo CEIBA (PRUEBA)',guest:'Bryan (PRUEBA)',token:'prueba-sin-registro-real',locale:'es'});
 if(missing.length) throw new Error('Missing template data');
 const result = await sendTemplate({to,template:'invite',data});
 console.log(JSON.stringify(result));
 if(result.status !== 'sent') process.exitCode=1;
}
main().catch(()=>{console.error('Invitation test failed');process.exitCode=1;});
