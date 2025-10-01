<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden text-gray-500 hover:text-gray-700">
              <Icon icon="heroicons:bars-3" class="w-6 h-6" />
            </button>
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon icon="heroicons:clipboard-document" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-xl font-bold text-gray-900">Task Management</h1>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-3 focus:outline-none">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-medium text-gray-900">{{ currentUser?.name }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
                </div>
                <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ currentUser?.name?.charAt(0).toUpperCase() }}
                </div>
              </button>

              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <aside :class="[
        'fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
        <nav class="mt-5 px-4 space-y-1">
          <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg">
            <Icon icon="heroicons:home" class="w-5 h-5 mr-3" />
            Dashboard
          </a>
        </nav>
      </aside>

      <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"></div>

      <main class="flex-1 p-6 lg:p-8">
        <div class="mb-8 hidden sm:block">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            <div class="card p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon icon="heroicons:clipboard-document" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Pending</p>
                  <p class="text-3xl font-bold text-yellow-600 mt-2">{{ stats.pending }}</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon icon="heroicons:clock" class="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">In Progress</p>
                  <p class="text-3xl font-bold text-purple-600 mt-2">{{ stats.inProgress }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon icon="heroicons:bolt" class="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Completed</p>
                  <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.completed }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon icon="heroicons:check-circle" class="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Recent Tasks</h2>
            <button @click="showCreateModal = true" class="btn btn-primary flex items-center">
              <Icon icon="heroicons:plus" class="w-5 h-5 mr-2" />
              Create Task
            </button>
          </div>

          <div class="flex flex-col gap-4 mb-6">
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon icon="heroicons:magnifying-glass" class="w-4 h-4 text-gray-500" />
              </div>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search tasks..."
                class="input pl-10 w-full"
                @input="debounceSearch"
              />
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Listbox v-model="filters.status" @update:modelValue="applyFilters" as="div" class="relative">
                <ListboxButton class="input w-full flex items-center justify-between">
                  <span class="truncate">{{ filters.status ? (filters.status === 'in-progress' ? 'In Progress' : filters.status.charAt(0).toUpperCase() + filters.status.slice(1)) : 'All Status' }}</span>
                  <Icon icon="heroicons:chevron-down" class="w-4 h-4 flex-shrink-0" />
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <ListboxOption v-for="status in ['', 'pending', 'in-progress', 'completed']" :key="status" :value="status" v-slot="{ active, selected }">
                      <div :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'cursor-pointer select-none relative py-2 pl-3 pr-9']">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                          {{ status === '' ? 'All Status' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1) }}
                        </span>
                        <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                          <Icon icon="heroicons:check" class="w-5 h-5" />
                        </span>
                      </div>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </Listbox>
              
              <Listbox v-model="filters.priority" @update:modelValue="applyFilters" as="div" class="relative">
                <ListboxButton class="input w-full flex items-center justify-between">
                  <span class="truncate">{{ filters.priority ? filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1) : 'All Priority' }}</span>
                  <Icon icon="heroicons:chevron-down" class="w-4 h-4 flex-shrink-0" />
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <ListboxOption v-for="priority in ['', 'low', 'medium', 'high']" :key="priority" :value="priority" v-slot="{ active, selected }">
                      <div :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'cursor-pointer select-none relative py-2 pl-3 pr-9']">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                          {{ priority === '' ? 'All Priority' : priority.charAt(0).toUpperCase() + priority.slice(1) }}
                        </span>
                        <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                          <Icon icon="heroicons:check" class="w-5 h-5" />
                        </span>
                      </div>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </Listbox>
              
              <Listbox v-model="pagination.limit" @update:modelValue="changeLimit" as="div" class="relative">
                <ListboxButton class="input w-full flex items-center justify-between">
                  <span class="truncate">{{ pagination.limit }} per page</span>
                  <Icon icon="heroicons:chevron-down" class="w-4 h-4 flex-shrink-0" />
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <ListboxOption v-for="limit in [5, 10, 25, 50]" :key="limit" :value="limit" v-slot="{ active, selected }">
                      <div :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'cursor-pointer select-none relative py-2 pl-3 pr-9']">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                          {{ limit }} per page
                        </span>
                        <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                          <Icon icon="heroicons:check" class="w-5 h-5" />
                        </span>
                      </div>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </Listbox>
            </div>
          </div>
          
          <!-- Sort Options -->
          <div class="mb-6">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                @click="setSorting('createdAt')" 
                class="px-3 py-1 text-sm rounded-full"
                :class="filters.sortBy === 'createdAt' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                Date 
                <span v-if="filters.sortBy === 'createdAt'">
                  {{ filters.order === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
              <button 
                @click="setSorting('title')" 
                class="px-3 py-1 text-sm rounded-full"
                :class="filters.sortBy === 'title' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                Title
                <span v-if="filters.sortBy === 'title'">
                  {{ filters.order === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
              <button 
                @click="setSorting('priority')" 
                class="px-3 py-1 text-sm rounded-full"
                :class="filters.sortBy === 'priority' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                Priority
                <span v-if="filters.sortBy === 'priority'">
                  {{ filters.order === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </div>
          </div>

          <div v-if="loading" class="text-center py-12">
            <svg class="animate-spin h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 mt-2">Loading tasks...</p>
          </div>

          <div v-else-if="tasks.length > 0" class="space-y-4">
            <div v-for="task in tasks" :key="task.id" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div class="flex-1 mb-3 sm:mb-0">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 mr-1">{{ task.title }}</h3>
                    <span :class="getStatusClass(task.status)" class="px-3 py-1 text-xs font-medium rounded-full">
                      {{ formatStatus(task.status) }}
                    </span>
                    <span :class="getPriorityClass(task.priority)" class="px-3 py-1 text-xs font-medium rounded-full">
                      {{ task.priority }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-3 break-words">{{ task.description }}</p>
                  <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span v-if="task.dueDate" 
                      :class="[
                        'flex items-center',
                        isOverdue(task.dueDate) ? 'text-red-600 font-bold' : ''
                      ]">
                      <Icon 
                        icon="heroicons:calendar" 
                        class="w-4 h-4 mr-1" 
                        :class="isOverdue(task.dueDate) ? 'text-red-600' : ''" 
                      /> 
                      Due: {{ formatDate(task.dueDate) }} 
                      <span v-if="isOverdue(task.dueDate)" class="ml-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">Overdue</span>
                    </span>
                    <span class="flex items-center">
                      <Icon icon="heroicons:clock" class="w-4 h-4 mr-1" /> Updated: {{ formatDate(task.updatedAt) }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="editTask(task)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Icon icon="heroicons:pencil-square" class="w-5 h-5" />
                  </button>
                  <button @click="deleteTask(task.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Icon icon="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <Icon icon="heroicons:clipboard-document" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 mb-4">No tasks found</p>
            <button @click="showCreateModal = true" class="btn btn-primary">
              Create Your First Task
            </button>
          </div>

          <div v-if="tasks.length > 0" class="mt-6 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200 pt-4 gap-4">
            <div class="flex justify-between sm:hidden w-full">
              <button 
                @click="goToPage(pagination.page - 1)" 
                :disabled="!pagination.hasPrevPage"
                :class="[
                  'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                  !pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                Previous
              </button>
              <button 
                @click="goToPage(pagination.page + 1)" 
                :disabled="!pagination.hasNextPage"
                :class="[
                  'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                  !pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> to 
                  <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of 
                  <span class="font-medium">{{ pagination.total }}</span> results
                </p>
              </div>
              <div class="overflow-x-auto">
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="goToPage(pagination.page - 1)"
                    :disabled="!pagination.hasPrevPage"
                    :class="[
                      'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400',
                      pagination.hasPrevPage ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                    ]"
                  >
                    <span class="sr-only">Previous</span>
                    <Icon icon="heroicons:chevron-left" class="h-5 w-5" />
                  </button>
                  
                  <template v-for="pageNumber in getPageNumbers()" :key="pageNumber">
                    <button
                      v-if="pageNumber !== '...'"
                      @click="goToPage(pageNumber)"
                      :class="[
                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                        pageNumber === pagination.page
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      {{ pageNumber }}
                    </button>
                    <span
                      v-else
                      class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                      ...
                    </span>
                  </template>
                  
                  <button
                    @click="goToPage(pagination.page + 1)"
                    :disabled="!pagination.hasNextPage"
                    :class="[
                      'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400',
                      pagination.hasNextPage ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                    ]"
                  >
                    <span class="sr-only">Next</span>
                    <Icon icon="heroicons:chevron-right" class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Task Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">
              {{ showEditModal ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <Icon icon="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="label">Title *</label>
              <input v-model="taskForm.title" type="text" required class="input" placeholder="Enter task title" />
            </div>

            <div>
              <label class="label">Description</label>
              <textarea v-model="taskForm.description" rows="3" class="input" placeholder="Enter task description"></textarea>
            </div>

            <div>
              <label class="label">Status</label>
              <select v-model="taskForm.status" class="input">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label class="label">Priority</label>
              <select v-model="taskForm.priority" class="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label class="label">Due Date</label>
              <input v-model="taskForm.dueDate" type="date" class="input" />
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ error }}
            </div>

            <div class="flex space-x-3 pt-4">
              <button type="button" @click="closeModal" class="btn btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" :disabled="submitting" class="btn btn-primary flex-1">
                {{ submitting ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <TransitionRoot appear :show="showConfirmModal" as="template">
    <Dialog as="div" @close="showConfirmModal = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ confirmModalTitle }}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ confirmModalMessage }}
                </p>
              </div>

              <div class="mt-4 flex space-x-3">
                <button
                  type="button"
                  class="btn btn-secondary flex-1"
                  @click="showConfirmModal = false"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-primary flex-1"
                  @click="() => { confirmModalAction(); showConfirmModal = false; }"
                >
                  Confirm
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Error Modal -->
  <TransitionRoot appear :show="showErrorModal" as="template">
    <Dialog as="div" @close="showErrorModal = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Error
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ errorModalMessage }}
                </p>
              </div>

              <div class="mt-4">
                <button
                  type="button"
                  class="btn btn-primary w-full"
                  @click="showErrorModal = false"
                >
                  OK
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/services/api';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { Icon } from '@iconify/vue';

const router = useRouter();
const authStore = useAuthStore();

const currentUser = computed(() => authStore.currentUser);

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const loading = ref(false);
const submitting = ref(false);
const error = ref('');

// Confirmation modal
const showConfirmModal = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalAction = ref(null);

// Error modal
const showErrorModal = ref(false);
const errorModalMessage = ref('');

const stats = ref({
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0
});

const tasks = ref([]);
const filters = ref({
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  order: 'desc'
});

// Pagination
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false
});

const taskForm = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: ''
});

const currentTaskId = ref(null);

// Fetch tasks
const fetchTasks = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: filters.value.sortBy,
      order: filters.value.order
    };
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.status) params.status = filters.value.status;
    if (filters.value.priority) params.priority = filters.value.priority;

    const response = await api.get('/tasks', { params });
    tasks.value = response.data.data;
    
    // Update pagination info
    pagination.value.total = response.data.meta.total;
    pagination.value.totalPages = response.data.meta.totalPages;
    pagination.value.hasNextPage = response.data.meta.hasNextPage;
    pagination.value.hasPrevPage = response.data.meta.hasPrevPage;
  } catch (err) {
    console.error('Error fetching tasks:', err);
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  pagination.value.page = page;
  fetchTasks();
};

const getPageNumbers = () => {
  const totalPages = pagination.value.totalPages;
  const currentPage = pagination.value.page;
  
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const pageNumbers = [1];
  
  if (currentPage > 3) {
    pageNumbers.push('...');
  }
  
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }
  
  if (currentPage < totalPages - 2) {
    pageNumbers.push('...');
  }
  
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }
  
  return pageNumbers;
};

let searchTimeout = null;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    fetchTasks();
  }, 500);
};

const applyFilters = () => {
  pagination.value.page = 1;
  fetchTasks();
};

const setSorting = (field) => {
  if (filters.value.sortBy === field) {
    filters.value.order = filters.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    filters.value.sortBy = field;
    filters.value.order = 'asc';
  }
  fetchTasks();
};

const changeLimit = () => {
  pagination.value.page = 1; 
  fetchTasks();
};

const fetchStats = async () => {
  try {
    const response = await api.get('/tasks/stats');
    stats.value = response.data.data;
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const editTask = (task) => {
  currentTaskId.value = task.id;
  taskForm.value = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate || ''
  };
  showEditModal.value = true;
};

const showConfirmation = (title, message, action) => {
  confirmModalTitle.value = title;
  confirmModalMessage.value = message;
  confirmModalAction.value = action;
  showConfirmModal.value = true;
};

const showError = (message) => {
  errorModalMessage.value = message;
  showErrorModal.value = true;
};

const deleteTask = async (id) => {
  showConfirmation(
    'Delete Task',
    'Are you sure you want to delete this task?',
    async () => {
      try {
        await api.delete(`/tasks/${id}`);
        await fetchTasks();
        await fetchStats();
      } catch (err) {
        showError('Failed to delete task');
      }
    }
  );
};

const handleSubmit = async () => {
  error.value = '';
  submitting.value = true;

  try {
    if (showEditModal.value) {
      await api.put(`/tasks/${currentTaskId.value}`, taskForm.value);
    } else {
      await api.post('/tasks', taskForm.value);
    }
    
    closeModal();
    await fetchTasks();
    await fetchStats();
  } catch (err) {
    error.value = err.message || 'Failed to save task';
  } finally {
    submitting.value = false;
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  currentTaskId.value = null;
  taskForm.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  };
  error.value = '';
};

// Helper functions
const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    'completed': 'bg-green-100 text-green-700'
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
};

const getPriorityClass = (priority) => {
  const classes = {
    'low': 'bg-blue-100 text-blue-700',
    'medium': 'bg-orange-100 text-orange-700',
    'high': 'bg-red-100 text-red-700'
  };
  return classes[priority] || 'bg-gray-100 text-gray-700';
};

const formatStatus = (status) => {
  return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isOverdue = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  dueDate.setHours(23, 59, 59, 999); // End of the due date
  const today = new Date();
  return dueDate < today;
};

watch(filters, () => {
  fetchTasks();
}, { deep: true });

// On mounted
onMounted(() => {
  fetchTasks();
  fetchStats();
});
</script>