<template>
    <base-card>
        <h2>Find Your Coach</h2>
        <span class="filter-option">
            <input type="checkbox" id="frontend" checked @change="setFilter" />
            <label for="frontend">Frontend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="backend" checked @change="setFilter" />
            <label for="backend">Backend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="career" checked @change="setFilter" />
            <label for="career">Career</label>
        </span>
    </base-card>
</template>

<script>
export default {
    emit: ['change-filter'],
    data() {
        return {
            filters: {
                frontend: true,
                backend: true,
                career: true,
            }
        } 
    },
    methods: {
        setFilter(event) {
            const inputId = event.target.id;
            const isActive = event.target.checked;
            const updateFilters = {
                ...this.filters,
                [inputId]: isActive // 將filters的內容值，分別在觸發checkbox時做更新（checkbox勾選取消則更新值為false、checkbox有勾選則更新值為true）
            };
            this.filters = updateFilters;
            this.$emit('change-filter', updateFilters);
        }
    }
}
</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}
</style>