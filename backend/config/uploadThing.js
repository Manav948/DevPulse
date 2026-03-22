import createUploadThing, { createRouteHandler } from "uploadthing/server";

const f = createUploadThing();
const uploadRouter = {
    profileImage: f({
        image: { maxFileSize: "8MB" },
    }).onUploadComplete(async ({ file }) => {
        console.log("Uploaded file URL : ", file.url);
        return {
            url: file.url
        }
    })
}

export const uploadthingHandler = createRouteHandler({
    router: uploadRouter
}) 