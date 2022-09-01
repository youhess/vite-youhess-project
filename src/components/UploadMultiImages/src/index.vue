<template>
  <div style="display:flex;flex-direction: column;align-items: flex-start;">
    <!---头部提示--->
    <slot name="headerTip" />
    <el-upload
      v-model:file-list="fileList"
      action=""
      :accept="accept"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :http-request="httpUpload"
      :data="aliData"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleEditChange"
      :limit="limit"
      :class="{ hide: hideUploadBtn }"
    >
      <!-- :class="{ hide: hideUploadBtn }": 控制上传组件是否显示 data中默认 hideUploadBtn: false -->
      <template #tip>
        <div class="el-upload__tip">
          {{tip}}
        </div>
      </template>
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="图片预览" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: "UploadMultiImages"
};
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadUserFile } from "element-plus";
import { ElMessage, UploadProps, ElNotification } from "element-plus";
import { aliStsToken } from "@/api/upload";
import OSS from "ali-oss";

const props = withDefaults(
  defineProps<{
    accept?: string;
    tip?: string;
    limit?: number;
    modelValue;
  }>(),
  {
    accept: "image/jpeg,image/png",
    tip:"",
    limit: 1,
    modelValue: []
  }
);

// const fileList = ref<UploadUserFile[]>([]);
const fileList = ref<UploadUserFile[]>([]);
const banner_list = ref([]); //拖拽插件不建议直接改变父组件的传值，所以另建一个新数组

onMounted(() => {
  banner_list.value = props.modelValue.map(url => {
    return { url: url };
  });
  fileList.value = JSON.parse(JSON.stringify(banner_list.value));
});

//监听父组件值是否在变化
watch(props, (newValue, oldValue) => {
  if (newValue.modelValue.length == props.limit && props.limit != 0) {
    ElMessage({
      message: `当前最多可上传${props.limit}张图片!`,
      type: "warning"
    });
  } else {
    banner_list.value = newValue.modelValue.map(url => {
      return { url: url };
    });
    fileList.value = JSON.parse(JSON.stringify(banner_list.value));
  }
});

const emits = defineEmits<{
  (e: "update:modelValue", data): void;
}>();

const dialogImageUrl = ref<string>("");
const dialogVisible = ref<boolean>(false);
const hideUploadBtn = ref<boolean>(false);

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

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  hideUploadBtn.value = uploadFiles.length >= props.limit;
  // banner_list.value = uploadFiles;
  emits(
    "update:modelValue",
    uploadFiles.map(item => item.url)
  );
};

const handleEditChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  hideUploadBtn.value = uploadFiles.length >= props.limit;
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
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

const beforeAvatarUpload: UploadProps["beforeUpload"] = file => {
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
      let imgUrl = client.options.domain + client.options.object;
      let obj = {
        url: imgUrl
      };

      banner_list.value.push(obj);

      fileList.value = JSON.parse(JSON.stringify(banner_list.value));
      // banner_list.value = JSON.parse(JSON.stringify(fileList.value));

      emits(
        "update:modelValue",
        banner_list.value.map(item => item.url)
      );
    })
    .then(() => {})
    .catch(() => {});
};
</script>

<style lang="scss">
.el-upload-list__item-delete {
  margin-left: 16px !important;
}

.hide {
  .el-upload--picture-card {
    display: none !important;
  }
}
.el-upload-list__item {
  transition: none !important;
}
</style>
