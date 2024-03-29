import { BadRequestException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { FilesService } from "src/files/files.service";
import { ICreatePost, IUpdatePost } from "./post.interface";
import axios from "axios";
import { resolve } from "path";
import * as fs from "fs";
@Injectable()
export class PostService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly filesService: FilesService,
  ) {}
  async loadMedia(file: Express.Multer.File) {
    if (file) {
      const fileName = await this.filesService.createFile(file);
      return fileName;
    }
  }
  async create(data: ICreatePost) {
    const post = await this.databaseService.post.create({
      data: {
        title: data.title,
        content: data.content,
        header: data.header,
        keywords: data.keywords,
        description: data.description,
      },
    });
    await this.databaseService.media.create({
      data: {
        postId: post.id,
        url: data.media,
      },
      include: { post: true },
    });
    const res = this.getPostForAdmin(post.id);
    return res;
  }
  async delete(id: number) {
    const post = await this.databaseService.post.delete({ where: { id: id } });
    return post;
  }
  async publish(id: number) {
    const post = await this.databaseService.post.update({
      where: { id: id },
      data: { type: "PUBLISHED" },
      include: { media: true },
    });
    // let text = post.content
    //   .replace(/<img[^>]*>/g, "")
    //   .replace(/<strong\b[^>]*>/g, "<b>")
    //   .replace('class="ql-syntax" spellcheck="false">', "")
    //   .replace(/<\/strong>/g, "</b>")
    //   .replace(/<h1>(.*?)<\/h1>/g, "<b>")
    //   .replace(/<h2>(.*?)<\/h2>/g, "</b>")
    //   .replace(/<em\b[^>]*>/g, "<i>")
    //   .replace(/<\/em>/g, "</i>")
    //   .replace(/<b><pre\b[^>]/g, "<pre>")
    //   .replace(/<\/pre><\/b>>/g, "</pre>")
    //   .replace(/<br\s*\/?>/gs, "\n")
    //   .replace(/<\/p>/gs, "\n")
    //   .replace(/<p>/gs, "")
    //   .replace(/<span[^>]*>/gs, "")
    //   .replace(/<\/span>/gs, "")
    //   .replace(/<sup\b[^>]*>/gi, "[")
    //   .replace(/<\/sup>/gi, "]")
    //   .replace(/<sub\b[^>]*>/gi, "[")
    //   .replace(/<\/sub>/gi, "]")
    //   .replace(/<ol[^>]*>|<\/ol>|<ul[^>]*>|<\/ul>/gi, "")
    //   .replace(/<li\b[^>]*>(.*?)<\/li>/gi, "• $1\n");
    // // let text = post.content
    // //   .replace(/<img[^>]*>/g, "")
    // //   .replace(/<strong\b[^>]*>/g, "*")
    // //   .replace('class="ql-syntax" spellcheck="false">', "")
    // //   .replace(/<\/strong>/g, "*")
    // //   .replace(/<h1>(.*?)<\/h1>/g, "*")
    // //   .replace(/<h2>(.*?)<\/h2>/g, "*")
    // //   .replace(/<em\b[^>]*>/g, "_")
    // //   .replace(/<\/em>/g, "_")
    // //   .replace(/<b><pre\b[^>]/g, "```")
    // //   .replace(/<\/pre><\/b>>/g, "```")
    // //   .replace(/<br\s*\/?>/gs, "\n")
    // //   .replace(/<\/p>/gs, "\n")
    // //   .replace(/<p>/gs, "")
    // //   .replace(/<span[^>]*>/gs, "")
    // //   .replace(/<\/span>/gs, "")
    // //   .replace(/<sup\b[^>]*>/gi, "")
    // //   .replace(/<\/sup>/gi, "")
    // //   .replace(/<sub\b[^>]*>/gi, "")
    // //   .replace(/<\/sub>/gi, "")
    // //   .replace(/<ol[^>]*>|<\/ol>|<ul[^>]*>|<\/ul>/gi, "")
    // //   .replace(/<li\b[^>]*>(.*?)<\/li>/gi, "• $1\n")
    // //   .replace(/=/gi, "\\=")
    // //   .replace(/-/gi, "\\-")
    // //   .replace(/>/gi, "\\>")
    // //   .replace(/\./g, "\\.");
    // // Read the photo file
    // const photo = fs.readFileSync(
    //   resolve(__dirname, "..", "..", "static", post.header),
    // );
    // const photoUrl =
    //   "http://5.187.4.59:5000/e36f590b-b533-4369-a590-0a0cc92e95a5.png";
    // const botToken = "6292118007:AAF2wEBMrPUKpS5rxvl23zxfkHzBJFrmQMU";
    // // Form data for the request
    // const formData = new FormData();
    // text = `<a href="${photoUrl}">⁠</a>` + text;
    // formData.append("chat_id", "524803435");
    // formData.append("text", text);
    // formData.append("disable_web_page_preview", "false");
    // formData.append("parse_mode", "HTML");
    // try {
    //   // Axios POST request to send photo with HTML text
    //   const response = await axios.post(
    //     `https://api.telegram.org/bot${botToken}/sendMessage`,
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //       data: formData,
    //     },
    //   );
    // } catch (e) {
    //   console.log(e);
    // }
    return post;
  }
  async update(data: IUpdatePost) {
    try {
      const post = await this.databaseService.post.update({
        where: { id: data.id },
        data: {
          title: data.title,
          content: data.content,
          header: data.header,
          keywords: data.keywords,
          description: data.description,
        },
      });
      await this.databaseService.media.create({
        data: {
          postId: post.id,
          url: data.media,
        },
        include: { post: true },
      });
      const res = await this.getPostForAdmin(post.id);
      return res;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getPosts(skip: number, take: number, getAll: boolean) {
    let where = {};
    if (!getAll) {
      where = { type: { equals: "PUBLISHED" } };
    }
    const posts = await this.databaseService.post.findMany({
      where: where,
      include: { media: true },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    });
    return posts;
  }
  async getPost(id) {
    try {
      const post = await this.databaseService.post.findUnique({
        where: { id: id },
        include: { media: true },
      });
      if (post.type == "PUBLISHED") return post;
    } catch {
      return null;
    }
  }
  async view(id: number) {
    try {
      const post = await this.databaseService.post.findUnique({
        where: { id: id },
      });
      const res = await this.databaseService.post.update({
        where: { id: id },
        data: { views: post.views + 1 },
      });
      return res;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getPostForAdmin(id) {
    try {
      const post = await this.databaseService.post.findUnique({
        where: { id: id },
        include: { media: true },
      });
      return post;
    } catch {
      return null;
    }
  }
  async getLastPost() {
    const post = await this.databaseService.post.findMany({
      take: 1,
      include: { media: true },
      orderBy: {
        createdAt: "desc", // Assuming 'createdAt' is the field by which you want to order
      },
    });
    return post;
  }
}
