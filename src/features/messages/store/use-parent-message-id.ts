import {useQueryState} from "nuqs";

/*
 获取路径参数parentMessageId的useState hook结果
 */
// const [parentMessageId, setX] = useState("abcd")  <==> http://localhost:5000/?parentMessageId=abcd
export const useParentMessageId = () => {
    return useQueryState("parentMessageId");
}