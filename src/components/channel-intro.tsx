import {format} from "date-fns";

interface ChannelIntroProps {
    name: string;
    creationTime: number;
}

export default function ChannelIntro({name, creationTime}: ChannelIntroProps) {
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <p className="text-2xl font-bold flex items-center mb-2">
                # {name}
            </p>
            <p className="font-normal text-slate-800 mb-4">
                本频道创建于{format(new Date(creationTime), 'yyyy-MM-dd')}.
                <br/>
                在 <strong>#{name}</strong> 里一切都是刚刚开始.
            </p>
        </div>
    )
}