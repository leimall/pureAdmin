<script setup lang="ts">
import { reactive, ref, unref } from "vue";
import { useRouter } from "vue-router";
import { listProduct, updateProductStatus } from "@/api/product";
import CustomPic from "@/layout/components/lay-pic/index.vue";
import { formatToDateTime } from "@/utils/dateUtil";
import {
  ElButton,
  ElSelect,
  ElMessage,
  ElTabs,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElOption,
  ComponentSize,
  ElPagination
} from "element-plus";

defineOptions({
  name: "Product"
});

const activeName = ref("third");
const background = ref(false);
const disabled = ref(false);
const tableData = ref([]);
const size = ref<ComponentSize>("default");
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const status = ref(0);

const { push } = useRouter();
const action = item => {
  push(`/product/edit?id=${item.productId}`);
};

const getProductList = async () => {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    status: status.value
  };
  const res = await listProduct(params);
  if (res && res.code === 0) {
    total.value = res.data.total;
    tableData.value = res.data.list;
  }
};
getProductList();
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getProductList();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getProductList();
};
const changeStatus = async item => {
  const params = {
    productId: item.productId,
    status: item.status
  };
  const res = await updateProductStatus(params);
  if (res && res.code === 0) {
    ElMessage.success("修改成功");
    getProductList();
  }
};
const handleClick = (tab, event) => {
  const { name } = tab.props;
  activeName.value = name;
  console.log("当前点击的 tab 的 name 是:", name);

  console.error(tab);
  if (name === "first") {
    status.value = 1;
  } else if (tab === "second") {
    status.value = 2;
  } else {
    status.value = 0;
  }
  currentPage.value = 1;
  pageSize.value = 20;
  getProductList();
};
</script>

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="上架商品列表" name="first">
        <el-table
          :data="tableData"
          table-layout="auto"
          border
          stripe
          fit
          style="width: 100%"
        >
          <el-table-column prop="ID" label="ID" width="100" />

          <el-table-column prop="title" label="供应商图片" width="200">
            <template #default="scope">
              <CustomPic
                css="w-100px"
                pic-type="file"
                :pic-src="scope.row.supplier_product.main_img"
                preview
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品图片" width="200">
            <template #default="scope">
              <CustomPic
                css="w-120px"
                pic-type="file"
                :pic-src="scope.row.mainImg"
                preview
              />
              {{ scope.row.productId }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称" />
          <el-table-column prop="price" label="商品价格" width="100" />
          <el-table-column prop="priceOff" label="商品折扣" width="100" />
          <el-table-column prop="stock" label="商品库存" width="100" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-select
                v-model.number="scope.row.status"
                @change="changeStatus(scope.row)"
              >
                <el-option label="未上架" :value="0" />
                <el-option label="上架" :value="1" />
                <el-option label="下架" :value="2" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="left" label="日期" width="180">
            <template #default="scope">
              {{ formatToDateTime(scope.row.UpdatedAt) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="action(scope.row)"
                >Edit</el-button
              >
              <el-button type="danger" size="small"> Delete </el-button>
            </template>
          </el-table-column>
        </el-table>

        <br />
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 50, 100, 200, 400]"
            :size="size"
            layout="sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="下架商品列表" name="second">
        <el-table
          :data="tableData"
          table-layout="auto"
          border
          stripe
          fit
          style="width: 100%"
        >
          <el-table-column prop="ID" label="ID" width="100" />

          <el-table-column prop="title" label="供应商图片" width="200">
            <template #default="scope">
              <CustomPic
                css="w-100px"
                pic-type="file"
                :pic-src="scope.row.supplier_product.main_img"
                preview
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品图片" width="200">
            <template #default="scope">
              <CustomPic
                css="w-120px"
                pic-type="file"
                :pic-src="scope.row.mainImg"
                preview
              />
              {{ scope.row.productId }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称" />
          <el-table-column prop="price" label="商品价格" width="100" />
          <el-table-column prop="priceOff" label="商品折扣" width="100" />
          <el-table-column prop="stock" label="商品库存" width="100" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-select
                v-model.number="scope.row.status"
                @change="changeStatus(scope.row)"
              >
                <el-option label="未上架" :value="0" />
                <el-option label="上架" :value="1" />
                <el-option label="下架" :value="2" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="left" label="日期" width="180">
            <template #default="scope">
              {{ formatToDateTime(scope.row.UpdatedAt) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="action(scope.row)"
                >Edit</el-button
              >
              <el-button type="danger" size="small"> Delete </el-button>
            </template>
          </el-table-column>
        </el-table>

        <br />
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 50, 100, 200, 400]"
            :size="size"
            :disabled="disabled"
            :background="background"
            layout="sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="全部商品列表" name="third">
        <el-table
          :data="tableData"
          table-layout="auto"
          border
          stripe
          fit
          style="width: 100%"
        >
          <el-table-column prop="ID" label="ID" width="100" />

          <el-table-column prop="title" label="供应商图片" width="200">
            <template #default="scope">
              <CustomPic
                css="w-100px"
                pic-type="file"
                :pic-src="scope.row.supplier_product.main_img"
                preview
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品图片" width="200">
            <template #default="scope">
              <CustomPic
                css="w-120px"
                pic-type="file"
                :pic-src="scope.row.mainImg"
                preview
              />
              {{ scope.row.productId }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称" />
          <el-table-column prop="price" label="商品价格" width="100" />
          <el-table-column prop="priceOff" label="商品折扣" width="100" />
          <el-table-column prop="stock" label="商品库存" width="100" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-select
                v-model.number="scope.row.status"
                @change="changeStatus(scope.row)"
              >
                <el-option label="未上架" :value="0" />
                <el-option label="上架" :value="1" />
                <el-option label="下架" :value="2" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="left" label="日期" width="180">
            <template #default="scope">
              {{ formatToDateTime(scope.row.UpdatedAt) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
              <el-button type="primary" size="small" @click="action(scope.row)"
                >Edit</el-button
              >
              <el-button type="danger" size="small"> Delete </el-button>
            </template>
          </el-table-column>
        </el-table>

        <br />
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 50, 100, 200, 400]"
            :size="size"
            :disabled="disabled"
            :background="background"
            layout="sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
