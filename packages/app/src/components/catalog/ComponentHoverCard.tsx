// In packages/app/src/components/catalog/ComponentHoverCard.tsx


import { Entity } from '@backstage/catalog-model';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  makeStyles,
  Theme,
  CardActionArea,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme: Theme) => ({
  // This is the main card element
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.3s, transform 0.3s',
    '&:hover': {
      boxShadow: theme.shadows[10],
      transform: 'translateY(-4px)',
    },
  },
  cardActionArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  // This container holds the details that are ONLY visible on hover
  hoverDetails: {
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    marginTop: theme.spacing(2),
    // Specific hover magic:
    '$root:hover &': {
      opacity: 1,
    },
  },
  // Minimal content, always visible
  minimalContent: {
    flexGrow: 1,
  },
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

type ComponentHoverCardProps = {
  entity: Entity;
};

export const ComponentHoverCard = ({ entity }: ComponentHoverCardProps) => {
  const classes = useStyles();
  const resolveEntityRoute = useRouteRef(entityRouteRef);
  const entityLink = resolveEntityRoute({
    kind: entity.kind.toLowerCase(),
    namespace: entity.metadata.namespace?.toLowerCase() ?? 'default',
    name: entity.metadata.name,
  });

  // Extract details for the card
  const title = entity.metadata.title ?? entity.metadata.name;
  const description =
    entity.metadata.description ?? 'No description available.';
  const owner = entity.spec?.owner ?? 'No Owner';
  const lifecycle = entity.spec?.lifecycle ?? 'N/A';
  const tags = entity.metadata.tags ?? [];

  return (
    <Card className={classes.root}>
      <CardActionArea
        component={Link}
        to={entityLink}
        className={classes.cardActionArea}
      >
        <CardContent className={classes.cardContent}>
          {/* 1. MINIMAL CONTENT (Always Visible) */}
          <Box className={classes.minimalContent}>
            <Typography variant="h5" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description.length > 100
                ? `${description.substring(0, 100)}...`
                : description}
            </Typography>
          </Box>

          {/* 2. HOVER CONTENT (Reveals on Hover) */}
          <Box className={classes.hoverDetails}>
            <Typography variant="body2" gutterBottom>
              <strong>Owner:</strong>{' '}
              {typeof owner === 'string'
                ? owner
                : Array.isArray(owner)
                ? owner.join(', ')
                : owner && typeof owner === 'object'
                ? JSON.stringify(owner)
                : String(owner)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Lifecycle:</strong>{' '}
              {typeof lifecycle === 'string' || typeof lifecycle === 'number' || typeof lifecycle === 'boolean'
                ? String(lifecycle)
                : lifecycle && typeof lifecycle === 'object'
                ? JSON.stringify(lifecycle)
                : String(lifecycle)}
            </Typography>
            <Box>
              {tags.map(tag => (
                <Chip key={tag} label={tag} size="small" className={classes.chip} />
              ))}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};