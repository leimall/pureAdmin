<script setup lang="ts">
import { ref } from "vue";
import { formatToDateTime } from "@/utils/dateUtil";
import CustomPic from "@/layout/components/lay-pic/index.vue";
import UploadImage from "@/components/Upload";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import {
  ElTag,
  ElInput,
  ElInputNumber,
  ElForm,
  ElFormItem,
  ElButton,
  ElSelect,
  ElOption,
  ElDivider,
  ElDrawer,
  ElImage,
  ElDescriptions,
  ElCascader,
  ElMessage,
  ElDescriptionsItem
} from "element-plus";
import { useRouter, useRoute } from "vue-router";
import {
  getProductById,
  updateProduct,
  getProductCategory,
  updateProductCategory,
  deleteProuductCategory,
  getProductTags,
  updateProductTags,
  deleteProuductTag,
  getSkuTitle,
  postProductSKUTitle,
  postProductSKUValue,
  createProductDetail,
  getBrandListDBApi
} from "@/api/product";
import { getSupplierProductID } from "@/api/supplier";
import {
  setSortImgApi,
  setMainImgApi,
  deleteImage
} from "@/api/product/images.js";
import { createProductBrand } from "@/api/product/brand";
import { listImages } from "@/api/images";

defineOptions({
  name: "ProductEdit"
});

const formSize = ref<ComponentSize>("large");
const ruleFormRef = ref<FormInstance>();

const categoryLists = ref<
  Array<{
    ID: number;
    title: string;
  }>
>([]);
const tagsLists = ref([]);
const options = ref([]);
const skuValue = ref([]);
const skuLists = ref([]);
const skuTitle = ref([]);
const valueBrand = ref([]);
const loadingBrand = ref(false);
const backendBrand = ref([]);
const optionsBrand = ref([]);
const selectedSorts = ref([]);
const imageUrl = ref();
const optionsTags = ref([]);
const availableSortOptions = ref([2, 3, 4, 5, 6, 7, 8, 9]);

const supplier = ref({
  ID: 0,
  UpdatedAt: "",
  cost_price: 0,
  lead_time: 0,
  main_img: "",
  num1: 0,
  num2: 0,
  num3: 0,
  num4: 0,
  num5: 0,
  product_id: "",
  size1: "",
  size2: "",
  size3: "",
  size4: "",
  size5: "",
  status: 0,
  stock: 0,
  supplier_id: 0,
  supplier_product_code: ""
});
const detail = ref({
  lang: "",
  productId: "",
  content: ""
});

const loading = ref(true);
const loadingmain = ref(false);
const loadtags = ref(false);
const loadingSku = ref(false);
const loadingDetail = ref(false);
const loadingCategory = ref(false);
const loadingChangeImage = ref(false);
const drawerVisible = ref(false);

const createSkuObject = e => ({
  imgUrl: "",
  price: 0,
  priceOff: 0,
  productId: currentRow.value.productId,
  stock: 0,
  parentId: currentRow.value.Sku.ID,
  tagId: e.ID,
  title: e.title
});

const { push } = useRouter();
const { query } = useRoute();

interface ProductType {
  ID: number;
  ImageList: Array<{
    img_url: string;
    is_main: number;
    sort_id: number;
    product_id: string;
  }>;
  Brand: {
    ID: number;
    product_id: string;
    brand_id: number;
    brand_title: string;
    shape_id: number;
    shape_title: string;
    tag_id: number;
  };
  Category: Array<{
    tag_id: number;
    product_id: string;
    title: string;
    title_en: string;
  }>;
  Tags?: Array<{
    tag_id: number;
    title: string;
  }>;
  Sku: {
    ID: number;
    tagId: number;
    productId: string;
    title: string;
    list: Array<{
      img_url: string;
      price: number;
      priceOff: number;
      parentId: number;
      productId: string;
      stock: number;
      tagId: number;
      title: string;
    }>;
  };
  Detail?: Array<{
    ID: number;
    productId: string;
    content: string;
    lang: string;
  }>;
  desction: string;
  isDelete: number;
  mainImg: string;
  price: number;
  priceOff: number;
  productId: string;
  sales: number;
  seoDescription: string;
  seoKeywords: string;
  status: number;
  stock: number;
  title: string;
}

const currentRow = ref<ProductType>({
  ID: 0,
  Brand: {
    ID: 0,
    product_id: "",
    brand_id: 0,
    brand_title: "",
    shape_id: 0,
    shape_title: "",
    tag_id: 0
  },
  ImageList: [],
  Category: [],
  Tags: [],
  Sku: {
    ID: 0,
    tagId: 0,
    title: "",
    productId: "",
    list: []
  },
  desction: "",
  isDelete: 0,
  mainImg: "",
  price: 0,
  priceOff: 0,
  productId: "",
  sales: 0,
  seoDescription: "",
  seoKeywords: "",
  status: 0,
  stock: 0,
  title: ""
});

const getTableDet = async () => {
  try {
    const res = await getProductById(query.id as string);
    if (res) {
      currentRow.value = res.data;
      if (currentRow.value.Category && currentRow.value.Category.length > 0) {
        categoryLists.value = options.value.filter(
          v => !currentRow.value.Category.some(e => e.tag_id === v.ID)
        );
      }
      if (currentRow.value.Tags && currentRow.value.Tags.length > 0) {
        tagsLists.value = options.value.filter(
          v => !currentRow.value.Tags.some(e => e.tag_id === v.ID)
        );
      }
      if (currentRow.value.Sku.tagId) {
        if (currentRow.value.Sku.list && currentRow.value.Sku.list.length > 0) {
          skuValue.value = currentRow.value.Sku.list;
        } else {
          skuValue.value = skuLists.value
            .filter(v => v.parent_id === currentRow.value.Sku.tagId)
            .map(createSkuObject);
        }
      }
      if (currentRow.value.Brand) {
        valueBrand.value.push(currentRow.value.Brand.brand_id);
        valueBrand.value.push(currentRow.value.Brand.shape_id);
      }
      if (currentRow.value.Detail && currentRow.value.Detail.length > 0) {
        detail.value = currentRow.value.Detail[0];
      } else {
        detail.value = {
          lang: "en",
          productId: currentRow.value.productId,
          content: ""
        };
      }
    }
  } catch (error) {
    loading.value = false;
    console.error("获取产品详情失败：", error);
  } finally {
    loading.value = false;
  }
};
getTableDet();

const isSortSelected = (sortValue, currentSort) => {
  return selectedSorts.value.includes(sortValue) && sortValue !== currentSort;
};

const updateSelectedSorts = () => {
  selectedSorts.value = currentRow.value.ImageList.map(
    item => item.sort_id
  ).filter((sort_id): sort_id is number => sort_id !== 0); // 过滤掉未设置的排序
};

const handleSortChange = async (id, productId, sortId) => {
  loadingChangeImage.value = true;
  try {
    const res = await setSortImgApi({ id, productId, sortId });
    if (res && res.code === 0) {
      updateSelectedSorts();
      await getTableDet();
    }
    loadingChangeImage.value = false;
  } catch (error) {
    loadingChangeImage.value = false;
    console.error("更新排序失败：", error);
  }
};

const getskudata = async () => {
  try {
    const res = await getSkuTitle();
    if (res) {
      skuLists.value = res.data;
      skuTitle.value = res.data
        .filter(v => v.parent_id === 0)
        .map(createSkuObject);
    }
  } catch (error) {
    console.error("获取产品详情失败：", error);
  }
};

getskudata();

const getSupplierProductIDHandle = async () => {
  const { id } = query;
  try {
    const res = await getSupplierProductID(id);
    if (res && res.code === 0) {
      supplier.value = res.data;
    }
  } catch (error) {
    console.error("获取供应商失败：", error);
  }
};

getSupplierProductIDHandle();

const setMain = async e => {
  const { ID, product_id } = e;
  loadingChangeImage.value = true;
  console.error("setMain", ID, product_id);
  try {
    const res = await setMainImgApi({ ID, productId: product_id });
    console.error("object", res);
    if (res && res.code === 0) {
      await getTableDet();
    }
    loadingChangeImage.value = false;
  } catch (error) {
    loadingChangeImage.value = false;
    console.error("更新主图失败：", error);
  }
};

const onTitleChange = item => {
  skuValue.value = skuLists.value
    .filter(v => v.parent_id === item)
    .map(createSkuObject);
  const e = skuLists.value.filter(v => v.ID === item)[0];
  currentRow.value.Sku.tagId = e.ID;
  currentRow.value.Sku.title = e.title;
  currentRow.value.Sku.productId = currentRow.value.productId;
  updateskuTitile(currentRow.value.Sku);
  updateSkuValue();
};

const updateskuTitile = async item => {
  const { tagId } = item;
  console.error("updateskuTitile", item);
  if (tagId) {
    loadingSku.value = true;
    try {
      const res = await postProductSKUTitle(item);
      if (res && res.code === 0) {
        await getTableDet();
      }
      loadingSku.value = false;
    } catch (error) {
      console.error("更新SKU标题失败：", error);
      loadingSku.value = false;
    }
  }
};

const updateSkuValue = async () => {
  loadingSku.value = true;
  try {
    const res = await postProductSKUValue(skuValue.value);
    if (res && res.code === 0) {
      await getTableDet();
    }
    loadingSku.value = false;
  } catch (error) {
    console.error("更新SKU值失败：", error);
    loadingSku.value = false;
  }
};

const deleteImageHandle = async e => {
  const { ID, uuid } = e;
  loadingChangeImage.value = true;
  try {
    const res = await deleteImage({ ID, UUID: uuid });
    if (res && res.code === 0) {
      await getTableDet();
    }
  } catch (error) {
    loadingChangeImage.value = false;
  } finally {
    loadingChangeImage.value = false;
  }
};

const insertImage = (url: string) => {
  detail.value.content += `![图片](${url})`;
};

const commonlist = ref([]);
const getCommonList = async () => {
  try {
    const res = await listImages();
    if (res && res.code === 0) {
      commonlist.value = res.data.list;
    }
  } catch (err) {
    console.error("获取图片列表失败", err);
  } finally {
  }
};

getCommonList();

const save = async () => {
  loadingmain.value = true;
  try {
    const res = await updateProduct(currentRow.value);
    if (res && res.code === 0) {
      await getTableDet();
    }
    loadingmain.value = false;
  } catch (error) {
    loadingmain.value = false;
    console.error("保存失败：", error);
  }
};

const handleBrandChange = async value => {
  valueBrand.value = value;
  console.error("valueBrand.value", backendBrand.value);
  const brand = {
    id: currentRow.value.Brand.ID,
    product_id: currentRow.value.productId,
    brand_id: valueBrand.value[0],
    brand_title: backendBrand.value.filter(v => v.ID === valueBrand.value[0])[0]
      .title,
    shape_id: valueBrand.value[1],
    shape_title: backendBrand.value.filter(v => v.ID === valueBrand.value[1])[0]
      .title
  };

  const res = await createProductBrand(brand);
  if (res.code === 0) {
    ElMessage({
      message: "This is a success message.",
      type: "success"
    });
    // saveLoading.value = false
  } else {
    // saveLoading.value = false
    ElMessage({
      message: "Oops, this is an error message.",
      type: "warning"
    });
  }
};

const uploadImageSuccess = async () => {
  loadingChangeImage.value = true;
  try {
    await getTableDet();
    loadingChangeImage.value = false;
  } catch (error) {
    loadingChangeImage.value = false;
    console.error("上传图片成功后处理失败：", error);
  }
};

const setCategory = async item => {
  const { ID, title_en } = item;
  loadingCategory.value = true;
  try {
    const params = {
      tag_id: ID,
      product_id: currentRow.value.productId,
      title: title_en
    };
    const res = await updateProductCategory(params);
    if (res && res.code === 0) {
      // categoryLists.value = categoryLists.value.filter((v) => v.ID !== ID)
      await getTableDet();
    }
    setTimeout(() => {
      loadingCategory.value = false;
    }, 1000);
  } catch (error) {
    console.error("设置分类失败：", error);
    loadingCategory.value = false;
  }
};

const deleteCategory = async item => {
  const { ID } = item;
  loadingCategory.value = true;
  try {
    const res = await deleteProuductCategory({ ID: ID });
    if (res && res.code === 0) {
      await getTableDet();
    }
    setTimeout(() => {
      loadingCategory.value = false;
    }, 1000);
  } catch (error) {
    console.error("删除分类失败：", error);
    loadingCategory.value = false;
  }
};

const gettags = async () => {
  const res = await getProductTags();
  if (res && res.data?.length > 0) {
    tagsLists.value = res.data;
    optionsTags.value = res.data;
  }
};
gettags();

const setTags = async item => {
  const { ID, title_en } = item;
  loadtags.value = true;
  try {
    const params = {
      tag_id: ID,
      product_id: currentRow.value.productId,
      title: title_en
    };
    const res = await updateProductTags(params);
    if (res && res.code === 0) {
      // tagsLists.value = tagsLists.value.filter((v) => v.ID !== ID)
      await getTableDet();
    }
    setTimeout(() => {
      loadtags.value = false;
    }, 1000);
  } catch (error) {
    console.error("更新标签失败：", error);
    loadtags.value = false;
  }
};

const deleteTags = async item => {
  const { ID } = item;
  loadtags.value = true;
  try {
    const res = await deleteProuductTag({ ID: ID });
    if (res && res.code === 0) {
      await getTableDet();
    }
    setTimeout(() => {
      loadtags.value = false;
    }, 1000);
  } catch (error) {
    console.error("删除标签失败：", error);
    loadtags.value = false;
  }
};

const getCategory = async () => {
  const res = await getProductCategory();
  if (res && res.data?.length > 0) {
    categoryLists.value = res.data;
    options.value = res.data;
  }
};
getCategory();
const getBrandLists = async () => {
  loadingBrand.value = true;
  try {
    const res = await getBrandListDBApi();
    if (res && res.data?.length > 0) {
      backendBrand.value = res.data;
      optionsBrand.value = buildTree(backendBrand.value) || [];
    }
    setTimeout(() => {
      loadingBrand.value = false;
    }, 1000);
  } catch (error) {
    console.error("获取品牌失败：", error);
    loadingBrand.value = false;
  }
};
getBrandLists();

const buildTree = data => {
  const map = new Map();
  const result = [];

  data.forEach(item => {
    map.set(item.ID, {
      value: item.ID,
      label: item.title,
      children: []
    });
  });

  data.forEach(item => {
    if (item.parent_id === 0) {
      result.push(map.get(item.ID)); // 根节点
    } else {
      const parent = map.get(item.parent_id);
      if (parent) {
        parent.children.push(map.get(item.ID)); // 子节点
      }
    }
  });

  // 只保留根节点的直接子节点，移除更深层级的子节点
  result.forEach(result => {
    result.children = result.children.map(child => {
      return { value: child.value, label: child.label };
    });
  });

  return result;
};
</script>

<template>
  <div v-loading="loading" class="p-4 bg-white">
    <el-form
      ref="ruleFormRef"
      :model="currentRow"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <div class="flex mb-10">
        <div v-loading="loadingmain" class="w-1/2">
          <div v-if="currentRow.mainImg">
            <el-form-item label="商品主图: ">
              <div class="max-w-96">
                <CustomPic
                  pic-type="file"
                  :pic-src="currentRow.mainImg"
                  preview
                />
              </div>
            </el-form-item>
          </div>
          <el-form-item label="">
            <el-input
              v-model="currentRow.mainImg"
              class="m-4"
              disabled
              placeholder="Please input"
            >
              <template #prepend>URL:</template>
            </el-input>
          </el-form-item>

          <el-form-item label="商品显示标题: " prop="title">
            <el-input v-model="currentRow.title" />
          </el-form-item>
          <el-form-item label="商品描述: " prop="desction">
            <el-input v-model="currentRow.desction" />
          </el-form-item>
          <el-form-item label="seo关键字: " prop="title">
            <el-input v-model="currentRow.seoKeywords" />
          </el-form-item>
          <el-form-item label="SEO描述: " prop="seoDescription">
            <el-input v-model="currentRow.seoDescription" />
          </el-form-item>
          <el-form-item label="价格: " prop="price">
            <el-input-number
              v-model="currentRow.price"
              :precision="2"
              :step="0.1"
              :max="999999999"
              :min="1"
            />
          </el-form-item>
          <el-form-item label="价格折扣: " prop="priceOff">
            <el-input v-model.number="currentRow.priceOff" />
          </el-form-item>
          <el-form-item label="库存数量: " prop="stock">
            <el-input v-model.number="currentRow.stock" />
          </el-form-item>
          <el-form-item label="状态:" prop="title" style="width: 220px">
            <el-select v-model="currentRow.status">
              <el-option label="未上架" :value="0" />
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="2" />
            </el-select>
          </el-form-item>
          <div class="text-right">
            <ElButton type="success" :loading="loading" @click="save">
              保存
            </ElButton>
          </div>
        </div>
        <div class="w-1/2 ml-20 border rounded border-gray-300 p-8">
          <el-descriptions
            class="margin-top"
            title="供货商商品信息表"
            border
            :column="1"
            size="default"
          >
            <el-descriptions-item label="货品图片">
              <div class="max-w-96">
                <CustomPic
                  css="w-180px"
                  pic-type="file"
                  :pic-src="supplier.main_img"
                  preview
                />
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="货品名称">{{
              supplier.supplier_product_code
            }}</el-descriptions-item>
            <el-descriptions-item :label="supplier.size1">
              <el-tag size="small">{{ supplier.num1 }}</el-tag> 个
            </el-descriptions-item>
            <el-descriptions-item :label="supplier.size2">
              <el-tag size="small">{{ supplier.num2 }}</el-tag> 个
            </el-descriptions-item>
            <el-descriptions-item :label="supplier.size3">
              <el-tag size="small">{{ supplier.num3 }}</el-tag> 个
            </el-descriptions-item>
            <el-descriptions-item :label="supplier.size4">
              <el-tag size="small">{{ supplier.num4 }}</el-tag> 个
            </el-descriptions-item>
            <el-descriptions-item :label="supplier.size5">
              <el-tag size="small">{{ supplier.num5 }}</el-tag> 个
            </el-descriptions-item>
            <el-descriptions-item label="进货价格">
              {{ supplier.cost_price }} 元
            </el-descriptions-item>
            <el-descriptions-item label="库存数量">
              {{ supplier.stock }} 个
            </el-descriptions-item>
            <el-descriptions-item label="发货时间 (O 表示有现货)">
              {{ supplier.lead_time }} 天
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <el-divider content-position="left">设置商品分类</el-divider>
      <div v-loading="loadingCategory" class="flex mb-10">
        <div class="w-1/2 mr-4">
          <div class="text-primary mb-2">已选分类:</div>
          <div v-if="currentRow.Category && currentRow.Category.length > 0">
            <div class="border border-blue-500 p-4 rounded-md">
              <el-tag
                v-for="(item, index) in currentRow.Category"
                :key="index"
                effect="dark"
                class="m-2 cursor-pointer"
                type="primary"
                @click="deleteCategory(item)"
                >{{ item.title }}</el-tag
              >
            </div>
          </div>
          <div v-else>
            <div class="border border-blue-500 p-4 rounded-md">暂无分类</div>
          </div>
        </div>

        <div class="w-1/2 ml-4">
          <div class="text-primary mb-2">选择分类:</div>
          <div class="border border-primary p-4 rounded-md">
            <el-tag
              v-for="(item, index) in categoryLists"
              :key="index"
              effect="dark"
              class="m-2 cursor-pointer"
              type="warning"
              @click="setCategory(item)"
              >{{ item.title }} - {{ item.title_en }}</el-tag
            >
          </div>
        </div>
      </div>

      <el-divider content-position="left">设置商品标签</el-divider>
      <div v-loading="loadtags" class="flex mb-10">
        <div class="w-1/2 mr-4">
          <div class="text-primary mb-2">已选标签:</div>
          <div v-if="currentRow.Tags && currentRow.Tags.length > 0">
            <div class="border border-blue-500 p-4 rounded">
              <el-tag
                v-for="(item, index) in currentRow.Tags"
                :key="index"
                effect="dark"
                class="m-2 cursor-pointer"
                type="primary"
                @click="deleteTags(item)"
                >{{ item.title }}</el-tag
              >
            </div>
          </div>
          <div v-else>
            <div class="border border-blue-500 p-4 rounded">暂无标签</div>
          </div>
        </div>
        <div class="w-1/2 ml-4">
          <div class="text-primary mb-2">选择标签:</div>
          <div class="border border-primary p-4 rounded">
            <el-tag
              v-for="(item, index) in tagsLists"
              :key="index"
              effect="dark"
              class="m-2 cursor-pointer"
              type="warning"
              @click="setTags(item)"
              >{{ item.title }} - {{ item.title_en }}</el-tag
            >
          </div>
        </div>
      </div>
      <el-divider content-position="left">设置商品品牌</el-divider>
      <div v-loading="loadingBrand" class="mb-20px">
        <el-cascader
          v-model="valueBrand"
          :options="optionsBrand"
          @change="handleBrandChange"
        />
      </div>

      <el-divider content-position="left">设置商品规格</el-divider>
      <div v-loading="loadingSku" class="mb-20px">
        <el-form-item
          label="sku标题: "
          placeholder="选择"
          prop="title"
          style="width: 300px"
        >
          <el-select
            v-if="skuTitle.length"
            v-model="currentRow.Sku.tagId"
            @change="onTitleChange"
          >
            <el-option
              v-for="item in skuTitle"
              :key="item.tagId"
              :label="item.title"
              :value="item.tagId"
            />
          </el-select>
        </el-form-item>
        <template v-if="skuValue.length">
          <div
            v-for="(e, index) in skuValue"
            :key="index"
            class="pl-20 m-20px flex"
          >
            <div class="mr-4 text-md w-100px">
              <el-button effect="dark" class="w-80px" type="primary" round>{{
                e.title
              }}</el-button>
            </div>
            <div class="w-96 mx-4">
              <el-input v-model.number="e.stock" placeholder="请输库存的数量">
                <template v-slot:prepend>库存数量:</template>
              </el-input>
            </div>
            <div class="w-96 mx-4">
              <el-input v-model.number="e.price" placeholder="请输SKU的价格">
                <template v-slot:prepend>价格:</template>
              </el-input>
            </div>
            <div class="w-96 mx-4">
              <el-input v-model.number="e.priceOff" placeholder="请输SKU的折扣">
                <template v-slot:prepend>折扣:</template>
              </el-input>
            </div>
          </div>
          <div class="text-right">
            <el-button
              class="text-right"
              type="success"
              @click="updateSkuValue()"
              >保存</el-button
            >
          </div>
        </template>
      </div>

      <!-- 图看上传与设置 -->
      <div v-loading="loadingChangeImage">
        <el-divider content-position="left">展示图片设置</el-divider>

        <!-- 上传图片 -->
        <div
          v-if="currentRow.ImageList && currentRow.ImageList.length < 9"
          class="text-right"
        >
          <upload-image
            :image-url="imageUrl"
            :file-size="512"
            :max-w-h="1080"
            :product-id="currentRow.productId"
            @on-success="uploadImageSuccess"
          />
        </div>
        <div v-else-if="!currentRow.ImageList" class="text-right">
          <upload-image
            :image-url="imageUrl"
            :file-size="512"
            :max-w-h="1080"
            :product-id="currentRow.productId"
            @on-success="uploadImageSuccess"
          />
        </div>

        <!-- 图片展示和设置部分 -->
        <template
          v-if="currentRow.ImageList && currentRow.ImageList.length > 0"
        >
          <div v-for="(item, index) in currentRow.ImageList" :key="index">
            <el-divider v-if="index > 0" />
            <div class="m-4 flex">
              <!-- 图片展示 -->
              <div class="max-w-96">
                <CustomPic pic-type="file" :pic-src="item.img_url" preview />
              </div>

              <!-- 是否主图 -->
              <div v-if="item.is_main === 1">
                <el-form-item label="是否主图:">
                  <el-tag effect="dark" type="danger">主图</el-tag>
                </el-form-item>
                <el-form-item label="显示排序:"
                  >首图默认为第一张图</el-form-item
                >
              </div>

              <!-- 设置主图和排序 -->
              <div v-else>
                <el-form-item label="是否主图:">
                  <el-button
                    plain
                    size="default"
                    type="primary"
                    @click="setMain(item)"
                    >设置主图</el-button
                  >
                </el-form-item>

                <!-- 显示排序 -->
                <el-form-item
                  label="显示排序:"
                  size="default"
                  style="width: 220px"
                >
                  <el-select
                    v-model="item.sort_id"
                    @change="
                      handleSortChange(item.ID, item.product_id, item.sort_id)
                    "
                  >
                    <!-- 动态生成排序选项，禁用已选择的值 -->
                    <el-option
                      v-for="n in availableSortOptions"
                      :key="n"
                      :label="n > 0 ? `第 ${n} 张` : `未设置`"
                      :value="n"
                      :disabled="isSortSelected(n, item.sort_id)"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <!-- 删除图片 -->
              <el-button
                type="danger"
                plain
                size="default"
                @click="deleteImageHandle(item)"
                >删除</el-button
              >
            </div>
          </div>
        </template>
      </div>
    </el-form>
  </div>
</template>
