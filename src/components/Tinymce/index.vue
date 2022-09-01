<template>
  <div style="display: flex; flex-direction: column; align-items: flex-start">
    <!---头部提示--->
    <slot name="headerTip" />
    <editor v-model="content" tag-name="div" :init="init" />
  </div>
</template>

<script lang="ts">
import { ref,nextTick } from "vue";
import { ElMessage } from "element-plus";
import { aliStsToken } from "@/api/upload";
import OSS from "ali-oss";
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme"; // 引用主题文件
import "tinymce/icons/default"; // 引用图标文件
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink"; //锚点
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap"; //特殊字符
import "tinymce/plugins/code"; //查看源码
import "tinymce/plugins/codesample"; //插入代码
import "tinymce/plugins/directionality"; //
// import "tinymce/plugins/fullpage"; //页面属性编辑
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help"; //帮助
import "tinymce/plugins/hr"; //横线
import "tinymce/plugins/image"; //图片
import "tinymce/plugins/imagetools"; //图片工具
import "tinymce/plugins/importcss"; //图片工具
import "tinymce/plugins/insertdatetime"; //时间插入
// import "tinymce/plugins/media"; //媒体插入
import "tinymce/plugins/nonbreaking"; //
import "tinymce/plugins/noneditable"; //不间断空格
import "tinymce/plugins/pagebreak"; //分页
import "tinymce/plugins/paste"; //粘贴
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/print"; //打印
import "tinymce/plugins/quickbars"; //快捷菜单
import "tinymce/plugins/save"; //保存
import "tinymce/plugins/searchreplace"; //查询替换
import "tinymce/plugins/spellchecker"; //拼写检查
import "tinymce/plugins/tabfocus"; //
import "tinymce/plugins/template"; //插入模板
import "tinymce/plugins/textpattern"; //
import "tinymce/plugins/toc"; //
import "tinymce/plugins/visualblocks"; //
import "tinymce/plugins/visualchars"; //
import "tinymce/plugins/wordcount"; //数字统计

export default {
  name: "tinymce",
  props: {
    modelValue: String
  },
  components: {
    editor: Editor
  },
  emits: { "update:modelValue": null },
  setup(props, context) {
    const aliData = ref({
      Region: "",
      AccessKeyId: "",
      AccessKeySecret: "",
      Domain: "",
      EndPoint: "",
      SecurityToken: "",
      BucketName: "",
      ObjectName: ""
    });

    const imageUrl = ref("");

    //从后台获取第一步所需的数据
    const getAliData = async (file): Promise<boolean> => {
      try {
        let param = {
          filePath: file.name
        };
        const res: any = await aliStsToken(param);
        aliData.value = res.Data;
        console.log("aliData", aliData.value);

        return true;
      } catch (e) {
        console.log(e);
        return false;
      } finally {
      }
    };

    const httpUpload = async (file: { file: any }): Promise<boolean> => {
      try {
        let client = new OSS({
          region: aliData.value?.Region,
          accessKeyId: aliData.value?.AccessKeyId,
          accessKeySecret: aliData.value?.AccessKeySecret,
          domain: aliData.value?.Domain,
          endPoint: aliData.value?.EndPoint,
          stsToken: aliData.value?.SecurityToken,
          bucket: aliData.value?.BucketName,
          object: aliData.value?.ObjectName
        });

        const res: any = await client.put(client.options.object, file, {});
        // imageUrl.value = client.options.domain + client.options.object;
        imageUrl.value = res.url;
        return true;
      } catch (e) {
        console.log(e);
        return false;
      } finally {
      }
    };

    const init = {
      language_url: require("../../assets/tinymce/zh-Hans.js"), // 中文语言包路径
      language: "zh-Hans",
      skin_url: require("tinymce/skins/ui/oxide/skin.css"), // 编辑器皮肤样式
      menubar: false, // 隐藏菜单栏
      autoresize_bottom_margin: 50,
      max_height: 500,
      min_height: 350,
      //   height: 320,
      toolbar_mode: "none",
      plugins:
        "wordcount visualchars visualblocks toc textpattern template tabfocus spellchecker searchreplace save quickbars print preview paste pagebreak noneditable nonbreaking  insertdatetime importcss imagetools image hr help fullscreen  directionality codesample code charmap link code table lists advlist anchor autolink autoresize autosave", // 插件需要import进来
      toolbar:
        "formats undo redo paste print fontsizeselect fontselect template |wordcount ltr rtl visualchars visualblocks toc spellchecker searchreplace|save preview pagebreak nonbreaking| image|outdent indent aligncenter alignleft alignright alignjustify lineheight  underline quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic  strikethrough hr charmap link insertdatetime|subscript superscript cut codesample code |anchor preview fullscreen|help",
      content_style: "p {margin: 5px 0; font-size: 14px}",
      fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
      font_formats:
        "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
      branding: false,
      elementpath: false,
      resize: false, // 禁止改变大小
      statusbar: false, // 隐藏底部状态栏
      //   图片上传
      images_upload_handler: function (blobInfo, success, failure) {
        // 默认插入base64方式
        // const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        // success(img)
        console.log("blobInfo.blob()", blobInfo.blob());
        const file_type = blobInfo.blob().type;
        const name =
          (blobInfo.filename && blobInfo.filename()) || blobInfo.blob().name;
        //格式校验
        const isAccept =
          file_type === "image/jpeg" ||
          file_type === "image/png" ||
          file_type === "image/GIF" ||
          file_type === "image/jpg" ||
          file_type === "image/BMP";
        //大小校验
        if (blobInfo.blob().size / 1024 / 1024 > 2) {
          failure("上传失败，图片大小请控制在 2M 以内");
          ElMessage({
            message: "上传失败，图片大小请控制在 2M 以内",
            type: "warning"
          });
        } else if (!isAccept) {
          ElMessage({
            message: "图片格式错误",
            type: "warning"
          });
          failure("图片格式错误");
        } else {
          getAliData(blobInfo.blob())
            .then(() => httpUpload(blobInfo.blob()))
            .then(() => {
              success(imageUrl.value);
            });
        }
      }
    };

       tinymce.init; // 初始化

    const revert_data = content => {
      context.emit("update:modelValue", content);
    };

    return {
      init,
      revert_data
    };
  },
  data() {
    return {
      content: this.modelValue
    };
  },
  mounted() {
  },
  watch: {
    content(newVla,oldVla) {
      this.revert_data(this.content);
    },
    modelValue(newVla,oldVla) {
      this.content = newVla
    }
  }
};
</script>
