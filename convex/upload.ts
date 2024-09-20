import {mutation} from "./_generated/server";

// 生成上传链接
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});