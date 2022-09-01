<template>
  <div>
    <!--  list-type="picture-card" :show-file-list="true" -->
    <el-upload
      class="avatar-uploader"
      :class="currentMode == 'button' ? '' : 'avatar-uploader-image'"
      :accept="accept"
      action=""
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="httpUpload"
      :data="aliData"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <div v-else>
        <el-icon class="avatar-uploader-icon">
          <Plus />
        </el-icon>
        <div class="el-upload__text text-upload" style="" v-if="tipText">
          {{ tipText }}
        </div>
      </div>
    </el-upload>
    <!---提示--->
    <slot name="tip" />
  </div>
</template>

<script lang="ts">
export default {
  name: "UploadImage"
};
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { aliStsToken } from "@/api/upload";
import { ElMessage, UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import OSS from "ali-oss";

const props = withDefaults(
  defineProps<{
    accept?: string;
    modelValue?: string;
    tipText?: string;
    currentMode?: string; //当前是image点击还是button点击
  }>(),
  {
    accept: "image/jpeg,image/png",
    currentMode: "image",
    modelValue: ""
  }
);

const imageUrl = ref("");

//监听父组件值是否在变化
watch(props, (newValue, oldValue) => {
  imageUrl.value = newValue.modelValue;
});

onMounted(() => {
  imageUrl.value = props.modelValue;
});

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

const beforeAvatarUpload: UploadProps["beforeUpload"] = file => {
  console.log("file", file);
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  // const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG && !isPNG) {
    ElMessage({
      message: "图片只能是 JPG/PNG 格式!",
      type: "error"
    });
    return false;
  }
  // if (!isLt2M) {
  //     this.$message.error("图片大小不能超过 2MB!");
  //     return false;
  // }

  return getAliData(file);
};

//从后台获取第一步所需的数据
const getAliData = async (file): Promise<boolean> => {
  try {
    let param = {
      filePath: file.name
    };
    const res: any = await aliStsToken(param);
    aliData.value = res.Data;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  } finally {
  }
};

const emits = defineEmits<{
  (e: "update:modelValue", data: string): void;
}>();

const httpUpload = (file: { file: any }) => {
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

  return client
    .put(client.options.object, file?.file, {})
    .then(() => {
      imageUrl.value = client.options.domain + client.options.object;
      // imageUrl.value = 'https://' + client.options.bucket + '.' + client.options.endPoint + '/' + client.options.object

      emits("update:modelValue", imageUrl.value);

      // return client.get(client.options.object);
    })
    .then(() => {})
    .catch(() => {});
};
</script>

<style>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-image .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.avatar-uploader-image .el-upload:hover {
  border-color: #409eff;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  /* height: auto; */
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  /* height: 178px; */
  height: auto;
  display: block;
}

.text-upload {
  position: relative;
  top: -20px;
  color: #8c939d;
}
</style>
