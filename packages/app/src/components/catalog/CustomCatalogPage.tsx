import { Grid, makeStyles, Button, CircularProgress, Box } from '@material-ui/core';
import { Content, Header, Page, EmptyState } from '@backstage/core-components';
import {
  CatalogFilterLayout,
  EntityListProvider,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { ComponentHoverCard } from './ComponentHoverCard';

const useStyles = makeStyles(() => ({
  gridItem: {
    // Ensure the card can grow to fill the grid item
    height: '100%',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px',
  },
}));

/**
 * This is the custom renderer for the EntityList.
 * It now uses the useEntityList hook to get the data
 * and handles loading, error, and empty states.
 */
const CustomCatalogCardView = () => {
  const classes = useStyles();
  // We get the filtered entities from this hook, plus loading and error states
  const { entities, loading, error } = useEntityList();

  // 1. Handle Loading State
  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Handle Error State
  if (error) {
    return (
      <EmptyState
        missing="info"
        title="Error loading components"
        description="Something went wrong while fetching the component list."
      />
    );
  }

  // 3. Handle Empty State
  if (!entities || entities.length === 0) {
    return (
      <EmptyState
        missing="info"
        title="No components found"
        description="Your component catalog is empty. Start by adding some components!"
        action={
          <Button
            variant="contained"
            color="primary"
            href="/catalog-import" // Link to the import page
          >
            Import Components
          </Button>
        }
      />
    );
  }

  // 4. Render components if they exist
  return (
    <Grid container spacing={3}>
      {entities.map(entity => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={entity.metadata.uid}
          className={classes.gridItem}
        >
          <ComponentHoverCard entity={entity} />
        </Grid>
      ))}
    </Grid>
  );
};

export const CustomCatalogPage = () => (
  <Page themeId="home">
    <Header title="Component Catalog" subtitle="Your custom components" />
    <Content>
      {/* EntityListProvider handles fetching and filtering the data */}
      <EntityListProvider>
        {/* CatalogFilterLayout provides the sidebar filters */}
        <CatalogFilterLayout>
          {/*
            We remove the <EntityList> wrapper and
            just render our card view directly.
          */}
          <CustomCatalogCardView />
        </CatalogFilterLayout>
      </EntityListProvider>
    </Content>
  </Page>
);