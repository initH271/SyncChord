import {useQueryState} from "nuqs";

/*
 获取路径参数parentMessageId的useState hook结果
 */
// const [profileMemberId, setX] = useState("abcd")  <==> http://localhost:5000/?profileMemberId=abcd
export const useProfileMemberId = () => {
    return useQueryState("profileMemberId");
}