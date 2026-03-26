import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  CodeBlock,
  CopyClipboardButton,
  Field,
  IconButton,
  LoadingSpinner,
  RichText,
  Text,
} from '@serieslist/core-ui'
import React, { useState } from 'react'

import { graphql } from '#/generated/gql'
import { useToast } from '#/hooks'

import * as s from './IntegrationTokenForm.css'

const JELLYFIN_WEBHOOK_TEMPLATE = `{
  "notificationType": "{{NotificationType}}",
  "episodeImdbId": "{{Provider_imdb}}",
  "playedToCompletion": "{{PlayedToCompletion}}"
}`

const Instructions = () => (
  <RichText>
    <p>
      The Jellyfin integration will automatically mark episodes as seen that you
      watch in Jellyfin. To set it up:
    </p>

    <ol>
      <li>Generate an integrations token below</li>
      <li>
        Install the{' '}
        <a href="https://github.com/jellyfin/jellyfin-plugin-webhook">
          Jellyfin Webhook Plugin
        </a>
      </li>
      <li>Configure the plugin with the following values:</li>
      <ul>
        <li>
          <Text weight="medium" as="strong">
            Webhook URL:
          </Text>{' '}
          <code>https://api.serieslist.joosep.xyz/api/jellyfin-webhook</code>
        </li>
        <li>
          <Text weight="medium" as="strong">
            Notification type:
          </Text>{' '}
          Playback Stop
        </li>
        <li>
          <Text weight="medium" as="strong">
            Item Type:
          </Text>{' '}
          Episodes
        </li>
        <li>
          <Text weight="medium" as="strong">
            Template:
          </Text>{' '}
          <CodeBlock>{JELLYFIN_WEBHOOK_TEMPLATE}</CodeBlock>
        </li>
        <li>
          <Text weight="medium" as="strong">
            Request Header:
          </Text>{' '}
          <ul>
            <li>
              <Text weight="medium" as="strong">
                Key:
              </Text>{' '}
              Authorization
            </li>
            <li>
              <Text weight="medium" as="strong">
                Value:
              </Text>{' '}
              Your token from below
            </li>
          </ul>
        </li>
        <li>
          <Text weight="medium" as="strong">
            Request Header:
          </Text>{' '}
          <ul>
            <li>
              <Text weight="medium" as="strong">
                Key:
              </Text>{' '}
              Content-Type
            </li>
            <li>
              <Text weight="medium" as="strong">
                Value:
              </Text>{' '}
              <code>application/json</code>
            </li>
          </ul>
        </li>
      </ul>
    </ol>
  </RichText>
)

const GenerateTokenButton = ({ token }: { token: string | null }) => {
  const { showToast, showErrorToast } = useToast()

  const [generateToken, { loading: generateTokenLoading }] = useMutation(
    graphql(`
      mutation generateToken {
        generateToken {
          __typename
          ... on IntegrationSettings {
            integrationToken
          }
          ... on UnauthorizedError {
            __typename
            message
          }
        }
      }
    `),
    {
      update(cache, { data }) {
        cache.modify({
          fields: {
            integrationSettings: () => {
              return data?.generateToken.__typename === 'IntegrationSettings'
                ? data.generateToken
                : null
            },
          },
        })
      },
    },
  )

  const onGenerate = async () => {
    const res = await generateToken()

    if (res.data?.generateToken.__typename !== 'IntegrationSettings') {
      showErrorToast()
    } else {
      showToast({
        id: 'token-generated',
        title: 'New token generated.',
      })
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={onGenerate}
      disabled={generateTokenLoading}
    >
      {generateTokenLoading
        ? 'Generating...'
        : token
          ? 'Regenerate'
          : 'Generate'}
    </Button>
  )
}

export const IntegrationTokenForm = () => {
  const { data, loading } = useQuery(
    graphql(`
      query integrationSettings {
        integrationSettings {
          __typename
          ... on IntegrationSettings {
            integrationToken
          }
          ... on UnauthorizedError {
            __typename
            message
          }
        }
      }
    `),
  )

  const [isHidden, setIsHidden] = useState(true)

  if (loading) {
    return (
      <div className={s.loadingContainer}>
        <LoadingSpinner />
      </div>
    )
  }

  const settings =
    data?.integrationSettings.__typename === 'IntegrationSettings'
      ? data?.integrationSettings
      : undefined

  if (!settings) {
    return <div />
  }

  return (
    <div className={s.container}>
      <Text weight="medium" className={s.title} size="l">
        Jellyfin integration
      </Text>

      <Instructions />

      <hr className={s.separator} />

      <Field
        label="Integrations token"
        type={isHidden ? 'password' : 'text'}
        value={settings.integrationToken ?? ''}
        readOnly
        disabled
        name="integrationsToken"
        right={
          <div className={s.inputIconsContainer}>
            <IconButton
              name={isHidden ? 'eye' : 'eyeslash'}
              label={isHidden ? 'Show' : 'Hide'}
              onClick={(e) => {
                // Keep the tooltip open when clicking the hide button
                e.preventDefault()

                setIsHidden(!isHidden)
              }}
              size="s"
            />
            <CopyClipboardButton
              text={settings.integrationToken ?? ''}
              size="s"
            />
          </div>
        }
      />

      <GenerateTokenButton token={settings.integrationToken ?? null} />
    </div>
  )
}
