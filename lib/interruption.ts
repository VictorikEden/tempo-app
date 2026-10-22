import type {Activity} from './time';

export type InterruptionPlan={activities:Activity[];activity:Activity;resumeId?:string};
/** Produce a preview only. The caller commits schedule and tracking atomically. */
export function planInterruption(list:Activity[],activeId:string|undefined,activity:Activity,shift:boolean):InterruptionPlan{
  const minutes=activity.end-activity.start;
  if(!activity.name.trim()||!Number.isInteger(minutes)||minutes<1||minutes>240)throw Error('Enter a name and a duration from 1 to 240 minutes.');
  if(activity.start<0||activity.start>=1440||activity.end>1440)throw Error('This interruption crosses midnight. Add it through the timetable with explicit start and end times.');
  const result:Activity[]=[];
  let resumeId:string|undefined;
  for(const original of list){
    const a={...original,reminders:[...original.reminders]};
    const end=a.end<=a.start?a.end+1440:a.end;
    if(a.id===activeId&&a.start<=activity.start&&end>activity.start){
      if(a.start<activity.start)result.push({...a,end:activity.start});
      resumeId=activity.id+'-resume';
      result.push({...a,id:resumeId,start:activity.end,end:end+minutes});
    }else if(shift&&a.start>=activity.start){
      if(a.start+minutes>=1440)throw Error('Shifting would move an activity start into tomorrow. Choose “Keep later times” to preview overlaps instead.');
      result.push({...a,start:a.start+minutes,end:end+minutes});
    }else result.push(a);
  }
  result.push({...activity,name:activity.name.trim()});
  return {activities:result.sort((a,b)=>a.start-b.start),activity,resumeId};
}
