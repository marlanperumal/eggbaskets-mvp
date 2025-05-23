/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RetirementImport } from './routes/retirement'
import { Route as IncomeStatementImport } from './routes/income-statement'
import { Route as GoalsImport } from './routes/goals'
import { Route as CashFlowImport } from './routes/cash-flow'
import { Route as BalanceSheetImport } from './routes/balance-sheet'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const RetirementRoute = RetirementImport.update({
  id: '/retirement',
  path: '/retirement',
  getParentRoute: () => rootRoute,
} as any)

const IncomeStatementRoute = IncomeStatementImport.update({
  id: '/income-statement',
  path: '/income-statement',
  getParentRoute: () => rootRoute,
} as any)

const GoalsRoute = GoalsImport.update({
  id: '/goals',
  path: '/goals',
  getParentRoute: () => rootRoute,
} as any)

const CashFlowRoute = CashFlowImport.update({
  id: '/cash-flow',
  path: '/cash-flow',
  getParentRoute: () => rootRoute,
} as any)

const BalanceSheetRoute = BalanceSheetImport.update({
  id: '/balance-sheet',
  path: '/balance-sheet',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/balance-sheet': {
      id: '/balance-sheet'
      path: '/balance-sheet'
      fullPath: '/balance-sheet'
      preLoaderRoute: typeof BalanceSheetImport
      parentRoute: typeof rootRoute
    }
    '/cash-flow': {
      id: '/cash-flow'
      path: '/cash-flow'
      fullPath: '/cash-flow'
      preLoaderRoute: typeof CashFlowImport
      parentRoute: typeof rootRoute
    }
    '/goals': {
      id: '/goals'
      path: '/goals'
      fullPath: '/goals'
      preLoaderRoute: typeof GoalsImport
      parentRoute: typeof rootRoute
    }
    '/income-statement': {
      id: '/income-statement'
      path: '/income-statement'
      fullPath: '/income-statement'
      preLoaderRoute: typeof IncomeStatementImport
      parentRoute: typeof rootRoute
    }
    '/retirement': {
      id: '/retirement'
      path: '/retirement'
      fullPath: '/retirement'
      preLoaderRoute: typeof RetirementImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/balance-sheet': typeof BalanceSheetRoute
  '/cash-flow': typeof CashFlowRoute
  '/goals': typeof GoalsRoute
  '/income-statement': typeof IncomeStatementRoute
  '/retirement': typeof RetirementRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/balance-sheet': typeof BalanceSheetRoute
  '/cash-flow': typeof CashFlowRoute
  '/goals': typeof GoalsRoute
  '/income-statement': typeof IncomeStatementRoute
  '/retirement': typeof RetirementRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/balance-sheet': typeof BalanceSheetRoute
  '/cash-flow': typeof CashFlowRoute
  '/goals': typeof GoalsRoute
  '/income-statement': typeof IncomeStatementRoute
  '/retirement': typeof RetirementRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/balance-sheet'
    | '/cash-flow'
    | '/goals'
    | '/income-statement'
    | '/retirement'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/balance-sheet'
    | '/cash-flow'
    | '/goals'
    | '/income-statement'
    | '/retirement'
  id:
    | '__root__'
    | '/'
    | '/balance-sheet'
    | '/cash-flow'
    | '/goals'
    | '/income-statement'
    | '/retirement'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  BalanceSheetRoute: typeof BalanceSheetRoute
  CashFlowRoute: typeof CashFlowRoute
  GoalsRoute: typeof GoalsRoute
  IncomeStatementRoute: typeof IncomeStatementRoute
  RetirementRoute: typeof RetirementRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  BalanceSheetRoute: BalanceSheetRoute,
  CashFlowRoute: CashFlowRoute,
  GoalsRoute: GoalsRoute,
  IncomeStatementRoute: IncomeStatementRoute,
  RetirementRoute: RetirementRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/balance-sheet",
        "/cash-flow",
        "/goals",
        "/income-statement",
        "/retirement"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/balance-sheet": {
      "filePath": "balance-sheet.tsx"
    },
    "/cash-flow": {
      "filePath": "cash-flow.tsx"
    },
    "/goals": {
      "filePath": "goals.tsx"
    },
    "/income-statement": {
      "filePath": "income-statement.tsx"
    },
    "/retirement": {
      "filePath": "retirement.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
